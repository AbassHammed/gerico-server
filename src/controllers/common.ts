import { Request, Response } from 'express';
import { logservice } from '../services/loggerService';
import { checkAdmin } from './companyInfo';
import pdfUtils from '../repositories/pdfUtils';

export class CommonUtils {
  async retrieveThresholds(req: Request, res: Response) {
    try {
      const isAdmin = await checkAdmin(req.user.uid);
      if (!isAdmin) {
        res.status(401).json({
          error: `Vous avez essayé d'acccéder à une page qui nécéssite des droits adminstrateurs`,
          code: 'UNAUTHORIZED',
        });
        return;
      }

      const thresholds = await pdfUtils.getThresholds();

      res.status(200).json({ thresholds });
    } catch (error) {
      logservice.error('[retrieveThresholds]', error);
      res.status(501).json({ error: 'Erreur interne du serveur.' });
    }
  }
}
