/* eslint-disable quotes */
import { Request, Response } from 'express';
import { CreatePayslipInput } from '../middlewares/payslip.middleware';
import { checkAdmin } from './companyInfo';
import { IPayslip } from '../models/interface';
import { generateId } from '../utils/misc';
import payslipRepo from '../repositories/payslip';
import { logservice } from '../services/loggerService';

export class PayslipController {
  async create(req: Request<object, object, CreatePayslipInput>, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res
          .status(401)
          .json({ error: `Accès refusé : utilisateur non autorisé`, code: 'UNAUTHORIZED' });
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
        path_to_pdf: null,
      };

      const result = await payslipRepo.save(newPayslip);
      res.status(200).json({ result });
    } catch (error) {
      logservice.error('[create$PayslipController', error);
      res.status(501).json({ error: 'Erreur interne du serveur' });
    }
  }

  async update(req: Request<object, object, CreatePayslipInput>, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res
          .status(401)
          .json({ error: `Accès refusé : utilisateur non autorisé`, code: 'UNAUTHORIZED' });
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

      const result = await payslipRepo.update(newPayslip);
      res.status(200).json({ result });
    } catch (error) {
      logservice.error('[update$PayslipController]', error);
      res.status(501).json({ error: 'Erreur interne du serveur' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res
          .status(401)
          .json({ error: 'Accès refusé : utilisateur non autorisé', code: 'UNAUTHORIZED' });
      }

      const payslips = await payslipRepo.retrieveAll();

      res.status(200).json({ payslips });
    } catch (error) {
      logservice.error('[getAll$PayslipController]', error);
      res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  }

  async getAllUserPayslips(req: Request, res: Response) {
    try {
      const { uid } = req.params as { uid: string };

      const payslips = await payslipRepo.retrieveByUser(uid.trim());

      res.status(200).json({ payslips });
    } catch (error) {
      logservice.error('[getAllUserPayslips$PayslipController]', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }
}
