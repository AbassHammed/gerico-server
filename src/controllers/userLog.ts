import { Request, Response } from 'express';
import { checkAdmin } from './companyInfo';
import { ApiResponse } from '../services/ApiResponse';
import { logservice } from '../services/loggerService';
import { getPaginationParams } from '../utils/misc';
import userLogRepo from '../repositories/userLog';

export class UserLogController {
  async getLogs(req: Request, res: Response) {
    try {
      const isAdmin = checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const paginationsParams = getPaginationParams(req.query);
      const result = await userLogRepo.retrieveAll(paginationsParams);
      res.sendResponse(ApiResponse.success(200, result));
    } catch (error) {
      logservice.error('[getLogs$UserLogController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }

  async getUserLogs(req: Request, res: Response) {
    try {
      const { uid } = req.params as { uid: string };
      const paginationsParams = getPaginationParams(req.query);
      const result = await userLogRepo.retrieveByUserId(uid.trim(), paginationsParams);
      res.sendResponse(ApiResponse.success(200, result));
    } catch (error) {
      logservice.error('[getUserLogs$UserLogController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }
}
