/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from 'express';
import jwtServices from '../services/jwtServices';
import userRepo from '../repositories/users';
import { logservice } from '../services/loggerService';
import { ApiResponse } from '../services/ApiResponse';

declare global {
  namespace Express {
    export interface Request {
      user: {
        uid: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string;

    const authheader = req.headers.authorization;
    if (authheader && authheader.startsWith(`Bearer `)) {
      token = authheader.split(' ')[1];
    }

    if (!token) {
      return res.sendResponse(ApiResponse.error(401, 'Non autorisé - Aucun token fourni'));
    }

    const decoded = jwtServices.decode(token);

    if (!decoded) {
      return res.sendResponse(ApiResponse.error(401, 'Non autorisé - token invalide'));
    }

    const user = await userRepo.retrieveById(decoded.uid);

    if (!user) {
      return res.sendResponse(ApiResponse.error(401, 'Utilisateur introuvable'));
    }

    req.user = user;

    next();
  } catch (error: any) {
    logservice.error('Erreur dans require user middleware', error.message);
    res.sendResponse(ApiResponse.error(401, error.message));
  }
};
