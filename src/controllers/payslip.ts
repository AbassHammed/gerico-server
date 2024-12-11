/* eslint-disable quotes */
import { Request, Response } from 'express';
import { CreatePayslipInput } from '../middlewares/payslip.middleware';
import { checkAdmin } from './companyInfo';
import { IPayslip } from '../models/interface';
import { generateId, getPaginationParams } from '../utils/misc';
import payslipRepo from '../repositories/payslip';
import { logservice } from '../services/loggerService';
import { ApiResponse } from '../services/ApiResponse';

export class PayslipController {
  async create(req: Request<object, object, CreatePayslipInput>, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const { start_period, end_period, pay_date } = req.body;
      const startPeriod = new Date(start_period);
      const endPeriod = new Date(end_period);
      const payDate = new Date(pay_date);

      const newPayslip: IPayslip = {
        ...req.body,
        pid: generateId(),
        start_period: startPeriod,
        end_period: endPeriod,
        pay_date: payDate,
      };

      await payslipRepo.save(newPayslip);
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

      await payslipRepo.update(newPayslip);
      res.sendResponse(ApiResponse.success(200));
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
}
