import { Request, Response } from 'express';
import {
  ChangeDefaultPasswordInput,
  CreateEmployeeInput,
  ForgotPasswordInput,
  LoginInput,
  ResendResetPasswordCodeInput,
  ResetPasswordInput,
} from '../middlewares/employee.middleware';
import usersRepo from '../repositories/users';
import bcryptjs from 'bcryptjs';
import passwordManager from '../services/passwordManager';
import { IUser } from '../models/interface';
import { generateUUIDv4 } from '../utils/misc';
import { logservice } from '../services/loggerService';
import jwtServices from '../services/jwtServices';
import emailService from '../services/mail/mailServices';

function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**

```plaintext
 200 OK - La requête a réussi, et la réponse contient les données demandées.
 201 Created - La ressource a été créée avec succès suite à la requête.
 204 No Content - La requête a réussi, mais il n'y a pas de contenu à renvoyer.
 400 Bad Request - La requête est mal formée ou contient des données invalides.
 401 Unauthorized - La requête nécessite une authentification qui a échoué ou est manquante.
 403 Forbidden - La requête est comprise, mais l’accès est refusé par le serveur.
 404 Not Found - La ressource demandée est introuvable sur le serveur.
 409 Conflict - La requête ne peut pas être complétée en raison d'un conflit avec l'état actuel de la ressource.
 500 Internal Server Error - Une erreur inattendue s'est produite côté serveur.
 502 Bad Gateway - Le serveur a reçu une réponse invalide d’un autre serveur en amont.
 503 Service Unavailable - Le serveur est temporairement indisponible, généralement pour maintenance.
```
 *
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */

export class UsersController {
  async create(req: Request<object, object, CreateEmployeeInput>, res: Response) {
    try {
      const { email, last_name, date_of_birth, hire_date } = req.body;

      const admin = await usersRepo.retrieveById(req.user.uid);

      if (!admin?.is_admin) {
        return res.status(401).json({ error: 'Unauthorized user.', code: 'UNAUTHORIZED' });
      }

      const withEmail = await usersRepo.retrieveByEmail(email);

      if (withEmail) {
        return res.status(400).json({ error: 'The email is already used' });
      }

      const dateOfBirth = new Date(date_of_birth);

      const hireDate = new Date(hire_date);

      // in the future we would have a nested try-catch here for proper error handling
      const password = passwordManager.generateDefaultPassword(last_name, dateOfBirth);

      const salt = await bcryptjs.genSalt();

      const hashedPassword = await bcryptjs.hash(password, salt);

      const newEmployee: IUser = {
        ...req.body,
        date_of_birth: dateOfBirth,
        hire_date: hireDate,
        uid: generateUUIDv4(),
        hashed_password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        is_archived: false,
        reset_code: null,
        departure_date: null,
      };

      const result = await usersRepo.save(newEmployee);

      if (result !== true) {
        return res
          .status(401)
          .json({ error: 'An error occured while creating the user, please try again' });
      }

      // we may need to implement a services that retries sending the email for sometimes incase of error
      // or maybe we need a better implementation
      await emailService.sendWelcomeEmail(newEmployee.email, {
        civility: newEmployee.civility,
        lastName: newEmployee.last_name,
        defaultPass: password,
      });

      res.status(201).json({ message: 'The employee was successfully created.' });
    } catch (error) {
      logservice.info('[create]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request<object, object, LoginInput>, res: Response) {
    try {
      const { email, password, os, browser } = req.body;

      const user = await usersRepo.retrieveByEmail(email);

      if (!user) {
        return res
          .status(400)
          .json({ error: 'No user with the email provided.', code: 'ENOTFOUND' });
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.hashed_password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Incorrect password', code: 'EINCPASS' });
      }

      const isdefaultPassword = passwordManager.isDefaultPattern(password);

      const token = jwtServices.encode({ uid: user.uid });

      await emailService.sendConnectionAlertEmail(user.email, {
        civility: user.civility,
        lastName: user.last_name,
        loginDate: new Date().toISOString(),
        operatingSystem: os,
        browser,
      });

      if (isdefaultPassword) {
        return res.status(208).json({ code: 'DEFAULTPASS', token });
      }

      res.status(200).json({ token, user });
    } catch (error) {
      logservice.error('[login]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async forgotPassword(req: Request<object, object, ForgotPasswordInput>, res: Response) {
    try {
      const { email } = req.body;

      const user = await usersRepo.retrieveByEmail(email);

      if (!user) {
        return res.status(400).json({ error: 'Employee with this email does not exist' });
      }

      const resetCode = generateRandomCode();

      const updatedUser: IUser = {
        ...user,
        reset_code: resetCode,
        updated_at: new Date(),
      };

      const result = await usersRepo.update(updatedUser);

      if (result !== true) {
        return res.status(400);
      }

      await emailService.sendResetPasswordEmail(updatedUser.email, {
        civility: updatedUser.civility,
        lastName: updatedUser.last_name,
        code: updatedUser.reset_code,
      });

      res.status(201).json({ uid: updatedUser.uid, sent: true });
    } catch (error) {
      logservice.error('[forgotPassword]', error);
      res.status(500).json({ error: error.message });
    }
  }

  async changeDefaultPassword(
    req: Request<object, object, ChangeDefaultPasswordInput>,
    res: Response,
  ) {
    try {
      const { password } = req.body;

      const user = await usersRepo.retrieveById(req.user.uid);

      if (!user) {
        return res.status(400).json({ error: 'Employee with this email does not exist' });
      }

      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const updatedUser: IUser = {
        ...user,
        hashed_password: hashedPassword,
        updated_at: new Date(),
      };

      const upadate = await usersRepo.update(updatedUser);

      if (upadate !== true) {
        // This will never occur, cause the update method will either return true or throw an error, but you know error handling in case of incasity
        return res.status(400).json({ error: 'The user could not be updated' });
      }

      const token = jwtServices.encode({ uid: updatedUser.uid });

      res.status(200).json({ token, user: updatedUser });
    } catch (error) {
      logservice.error('[changeDefaultPassword]', error);
      res.status(500).json({ error: 'An internal error occured' });
    }
  }

  async resetPassword(req: Request<object, object, ResetPasswordInput>, res: Response) {
    try {
      const { uid, password, reset_code } = req.body;

      const user = await usersRepo.retrieveById(uid);

      if (!user) {
        return res.status(401).json({ error: 'The user does not exist' });
      }

      if (user.reset_code !== reset_code) {
        return res.status(401).json({ error: 'The code in incorrect' });
      }

      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const updatedUser: IUser = {
        ...user,
        hashed_password: hashedPassword,
        reset_code: null,
      };

      const result = await usersRepo.update(updatedUser);

      if (result !== true) {
        // as explained above, !!! never going to happen
        res.status(400).json({ error: 'The employee password could not be changed' });
      }

      res.status(201).json({ result: true });
    } catch (error) {
      logservice.error('[resetPassword]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async resendPasswordCode(
    req: Request<object, object, ResendResetPasswordCodeInput>,
    res: Response,
  ) {
    try {
      const { uid } = req.body;

      const user = await usersRepo.retrieveById(uid);

      if (!user) {
        return res.status(400).json({ error: 'This user does not exist' });
      }

      if (!user.reset_code) {
        return res.status(400).json({
          error: 'You have not make any password change request for us to send you a code.',
        });
      }

      await emailService.sendResetPasswordEmail(user.email, {
        civility: user.civility,
        lastName: user.last_name,
        code: user.reset_code,
      });

      res.status(200).json({ sent: true });
    } catch (error) {
      logservice.error('[resendPasswordCode]', error);
      res.status(500).json({ error: 'An unknown error occured while resending the email.' });
    }
  }

  async update(req: Request<any, object, CreateEmployeeInput>, res: Response) {
    try {
      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();

      const user = await usersRepo.retrieveById(trimmedUid);

      if (!user) {
        return res.status(400).json({ error: 'The user does not exist' });
      }

      const hire_date = new Date(req.body.hire_date);
      const date_of_birth = new Date(req.body.date_of_birth);

      const updatedUser: IUser = {
        ...user,
        ...req.body,
        hire_date,
        date_of_birth,
        updated_at: new Date(),
      };

      const result = await usersRepo.update(updatedUser);

      if (result !== true) {
        return res.status(400).json({ error: 'The user could not be updated' });
      }

      res.status(200).json({ result: true });
    } catch (error) {
      logservice.error('[update]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async retrieve(req: Request, res: Response) {
    try {
      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();

      const user = await usersRepo.retrieveById(trimmedUid);

      if (!user) {
        return res.status(400).json({ error: 'The user does not exist' });
      }

      res.status(200).json({ user });
    } catch (error) {
      logservice.error('[retrieve]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async retrieveAll(req: Request, res: Response) {
    try {
      const admin = await usersRepo.retrieveById(req.user.uid);

      if (!admin?.is_admin) {
        return res.status(401).json({ error: 'Unauthorized user.', code: 'UNAUTHORIZED' });
      }

      const users = await usersRepo.retrieveAll();

      res.status(200).json({ users });
    } catch (error) {
      logservice.error('[retrieveAll]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await usersRepo.retrieveById(req.user.uid);

      if (!user) {
        return res.status(400).json({ error: `The user does not exist` });
      }

      res.status(200).json({ user });
    } catch (error) {
      logservice.error('[getUser]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async resetToDefaultPassword(req: Request, res: Response) {
    try {
      const user = await usersRepo.retrieveById(req.user.uid);

      if (!user.is_admin) {
        return res.status(401).json({ error: 'Unauthorized user.', code: 'UNAUTHORIZED' });
      }

      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();
      const userToUpadate = await usersRepo.retrieveById(trimmedUid);

      if (!userToUpadate) {
        return res.status(400).json({ error: `The user does not exist` });
      }

      const password = passwordManager.generateDefaultPassword(
        userToUpadate.last_name,
        userToUpadate.date_of_birth,
      );

      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const updatedUser: IUser = {
        ...userToUpadate,
        hashed_password: hashedPassword,
        updated_at: new Date(),
      };

      const result = await usersRepo.update(updatedUser);

      if (result !== true) {
        return res.status(400).json({ error: 'The user could not be updated' });
      }

      res.status(200).json({ result: true });
    } catch (error) {
      logservice.error('[resetToDefaultPassword]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async resendWelcomeEmail(req: Request, res: Response) {
    try {
      const user = await usersRepo.retrieveById(req.user.uid);

      if (!user.is_admin) {
        return res.status(401).json({ error: 'Unauthorized user.', code: 'UNAUTHORIZED' });
      }

      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();
      const userToSendEmail = await usersRepo.retrieveById(trimmedUid);

      if (!userToSendEmail) {
        return res.status(400).json({ error: `The user does not exist` });
      }

      const password = passwordManager.generateDefaultPassword(
        userToSendEmail.last_name,
        userToSendEmail.date_of_birth,
      );

      const isDefaultPassword = await bcryptjs.compare(password, userToSendEmail.hashed_password);

      if (!isDefaultPassword) {
        return res.status(400).json({ error: 'The user has already changed the password' });
      }

      await emailService.sendWelcomeEmail(userToSendEmail.email, {
        civility: userToSendEmail.civility,
        lastName: userToSendEmail.last_name,
        defaultPass: password,
      });

      res.status(200).json({ sent: true, message: 'The email was successfully sent' });
    } catch (error) {
      logservice.error('[resendWelcomeEmail]', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
