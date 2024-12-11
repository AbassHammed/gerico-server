import { Request, Response } from 'express';
import { logservice } from '../services/loggerService';
import { checkAdmin } from './companyInfo';
import pdfUtils from '../repositories/common';
import { ApiResponse } from '../services/ApiResponse';

export class CommonUtils {
  async retrieveThresholds(req: Request, res: Response) {
    try {
      const isAdmin = await checkAdmin(req.user.uid);
      if (!isAdmin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const thresholds = await pdfUtils.getThresholds();

      return res.sendResponse(ApiResponse.success(200, { thresholds }));
    } catch (error) {
      logservice.error('[retrieveThresholds$CommonUtils]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }
  async retrieveDeductions(req: Request, res: Response) {
    try {
      const isAdmin = await checkAdmin(req.user.uid);
      if (!isAdmin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const deductions = await pdfUtils.getDeductions();

      return res.sendResponse(ApiResponse.success(200, { deductions }));
    } catch (error) {
      logservice.error('[retrieveDeductions$CommonUtils]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }
}
