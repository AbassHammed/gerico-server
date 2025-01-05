/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Request, Response } from 'express';
import { CreatePayslipInput } from '../middlewares/payslip.middleware';
import { checkAdmin } from './companyInfo';
import { IPayslip, LogType } from '../models/interface';
import { generateId, getPaginationParams } from '../utils/misc';
import payslipRepo from '../repositories/payslip';
import { logservice } from '../services/loggerService';
import { ApiResponse } from '../services/ApiResponse';
import loggingService from '../services/LogService';
import userLogRepo from '../repositories/userLog';
import emailService from '../services/mail/mailServices';
import usersRepo from '../repositories/users';
import { DateTime } from 'luxon';

export class PayslipController {
  async create(req: Request<object, object, CreatePayslipInput>, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const { start_period, end_period, pay_date } = req.body;
      const startPeriod = DateTime.fromISO(start_period, { zone: 'utc' }).setZone('Europe/Paris');
      const endPeriod = DateTime.fromISO(end_period, { zone: 'utc' }).setZone('Europe/Paris');
      const payDate = DateTime.fromISO(pay_date, { zone: 'utc' }).setZone('Europe/Paris');

      const newPayslip: IPayslip = {
        ...req.body,
        pid: generateId(),
        start_period: startPeriod.toJSDate(),
        end_period: endPeriod.toJSDate(),
        pay_date: payDate.toJSDate(),
      };

      const logEntry = loggingService.createLogEntry(newPayslip.uid, LogType.PAYSLIP_AVAILABLE, {
        period: `${startPeriod} - ${endPeriod}`,
      });

      await userLogRepo.save(logEntry);

      await payslipRepo.save(newPayslip);

      const user = await usersRepo.retrieveById(newPayslip.uid);

      if (!user) {
        return res.sendResponse(
          ApiResponse.error(
            404,
            `Nous n'avons pas pu trouver l'utilisateur associé à cette fiche de paie`,
          ),
        );
      }
      await emailService.sendPayslipAvailableEmail(user.email, {
        civility: user.civility,
        lastName: user.last_name,
        payPeriod: `${startPeriod.toFormat('dd MMMM yyyy, HH:mm', { locale: 'fr' })} - ${endPeriod.toFormat('dd MMMM yyyy, HH:mm', { locale: 'fr' })}`,
        depositDate: payDate.toFormat('dd MMMM yyyy, HH:mm', { locale: 'fr' }),
        documentLink: newPayslip.path_to_pdf,
      });

      res.sendResponse(
        ApiResponse.success(200, undefined, 'La fiche de paie est bien enregistré.'),
      );
    } catch (error) {
      logservice.error('[create$PayslipController', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }

  async update(req: Request<object, object, CreatePayslipInput>, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const { pid } = req.params as { pid: string };
      const trimmedPid = pid.trim();

      const payslip = await payslipRepo.retrieveById(trimmedPid);

      if (!payslip) {
        return res.status(400).json({ error: "La fiche de paie n'existe pas" });
      }

      const { start_period, end_period, pay_date } = req.body;
      const startPeriod = new Date(start_period);
      const endPeriod = new Date(end_period);
      const payDate = new Date(pay_date);

      const newPayslip: IPayslip = {
        ...payslip,
        ...req.body,
        start_period: startPeriod,
        end_period: endPeriod,
        pay_date: payDate,
      };

      const logEntry = loggingService.createLogEntry(newPayslip.uid, LogType.PAYSLIP_AVAILABLE, {
        period: `${startPeriod} - ${endPeriod}`,
      });

      await userLogRepo.save(logEntry);

      await payslipRepo.update(newPayslip);
      res.sendResponse(
        ApiResponse.success(200, undefined, 'La fiche de paie est bien mise à jour.'),
      );
    } catch (error) {
      logservice.error('[update$PayslipController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const paginationParams = getPaginationParams(req.query);
      const payslips = await payslipRepo.retrieveAll(paginationParams);

      res.sendResponse(ApiResponse.success(200, payslips));
    } catch (error) {
      logservice.error('[getAll$PayslipController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }

  async getAllUserPayslips(req: Request, res: Response) {
    try {
      const { uid } = req.params as { uid: string };

      const paginationParams = getPaginationParams(req.query);
      const payslips = await payslipRepo.retrieveByUser(uid.trim(), paginationParams);

      res.sendResponse(ApiResponse.success(200, payslips));
    } catch (error) {
      logservice.error('[getAllUserPayslips$PayslipController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const { pid } = req.params as { pid: string };
      const trimmedPid = pid.trim();

      await payslipRepo.delete(trimmedPid);

      res.sendResponse(ApiResponse.success(200, undefined, 'La fiche de paie est bien supprimée.'));
    } catch (error) {
      logservice.error('[delete$PayslipController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }
}
