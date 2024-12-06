/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from 'express';
import jwtServices from '../services/jwtServices';
import userRepo from '../repositories/users';
import { logservice } from '../services/loggerService';

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
      return res.status(401).json({ error: 'Non autorisé - Aucun token fourni' });
    }

    const decoded = jwtServices.decode(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Non autorisé - token invalide' });
    }

    const user = await userRepo.retrieveById(decoded.uid);

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    req.user = user;

    next();
  } catch (error: any) {
    logservice.error('Erreur dans require user middleware', error.message);
    res.status(401).json({ error: error.message });
  }
};
