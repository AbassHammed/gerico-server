/* eslint-disable quotes */
import { Request, Response } from 'express';
import {
  ChangeDefaultPasswordInput,
  CreateUserInput,
  ForgotPasswordInput,
  LoginInput,
  ResendResetPasswordCodeInput,
  ResetPasswordInput,
} from '../middlewares/users.middleware';
import usersRepo from '../repositories/users';
import bcryptjs from 'bcryptjs';
import passwordManager from '../services/passwordManager';
import { IUser, LogType } from '../models/interface';
import { generateId, generateRandomCode, getPaginationParams } from '../utils/misc';
import { logservice } from '../services/loggerService';
import jwtServices from '../services/jwtServices';
import emailService from '../services/mail/mailServices';
import { ApiResponse } from '../services/ApiResponse';
import loggingService from '../services/LogService';
import userLog from '../repositories/userLog';
import { DateTime } from 'luxon';

interface LoginResponse {
  token: string;
  user: IUser | null;
  code: string | null;
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
  async create(req: Request<object, object, CreateUserInput>, res: Response) {
    try {
      const { email, last_name, date_of_birth, hire_date, social_security_number } = req.body;

      const admin = await usersRepo.retrieveById(req.user.uid);

      if (!admin?.is_admin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const withEmail = await usersRepo.retrieveByEmail(email);

      if (withEmail) {
        return res.sendResponse(ApiResponse.error(400, "L'adresse e-mail est déjà utilisée."));
      }

      const dateOfBirth = new Date(date_of_birth);
      const hireDate = new Date(hire_date);
      const password = passwordManager.generateDefaultPassword(last_name, dateOfBirth);
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newEmployee: IUser = {
        ...req.body,
        date_of_birth: dateOfBirth,
        hire_date: hireDate,
        uid: generateId(),
        hashed_password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        social_security_number: social_security_number.replace(/\s+/g, ''),
        is_archived: false,
        reset_code: null,
        departure_date: null,
      };

      const result = await usersRepo.save(newEmployee);

      if (result !== true) {
        return res.sendResponse(
          ApiResponse.error(
            401,
            "Une erreur s'est produite lors de la création de l'utilisateur. Veuillez réessayer.",
          ),
        );
      }

      await emailService.sendWelcomeEmail(newEmployee.email, {
        civility: newEmployee.civility,
        lastName: newEmployee.last_name,
        defaultPass: password,
      });

      const log = loggingService.createLogEntry(newEmployee.uid, LogType.ACCOUNT_CREATED, {});
      await userLog.save(log);

      return res.sendResponse(
        ApiResponse.success(201, undefined, "L'employé a été créé avec succès."),
      );
    } catch (error) {
      logservice.info('[create$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async login(req: Request<object, object, LoginInput>, res: Response) {
    try {
      const { email, password, browser, os } = req.body;

      const user = await usersRepo.retrieveByEmail(email);

      if (!user) {
        return res.sendResponse(
          ApiResponse.error(400, "Aucun utilisateur trouvé avec l'adresse e-mail fournie."),
        );
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.hashed_password);

      if (!isPasswordCorrect) {
        return res.sendResponse(ApiResponse.error(400, 'Mot de passe incorrect.'));
      }

      if (user.is_archived) {
        return res.sendResponse(ApiResponse.error(400, 'Votre compte a été archivé.'));
      }

      const isdefaultPassword = passwordManager.isDefaultPattern(password);

      const token = jwtServices.encode({ uid: user.uid });

      await emailService.sendConnectionAlertEmail(user.email, {
        civility: user.civility,
        lastName: user.last_name,
        loginDate: DateTime.now()
          .setZone('Europe/Paris')
          .toLocaleString(DateTime.DATETIME_FULL, { locale: 'fr-FR' }),
        operatingSystem: os,
        browser,
      });

      let response: LoginResponse = {
        code: 'DEFAULTPASS',
        token,
        user: null,
      };

      if (isdefaultPassword) {
        return res.sendResponse(ApiResponse.success(208, response));
      }

      response = {
        code: null,
        token,
        user,
      };
      const log = loggingService.createLogEntry(user.uid, LogType.LOGIN_ALERT, {});
      await userLog.save(log);

      return res.sendResponse(ApiResponse.success(200, response));
    } catch (error) {
      logservice.error('[login$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async forgotPassword(req: Request<object, object, ForgotPasswordInput>, res: Response) {
    try {
      const { email } = req.body;

      const user = await usersRepo.retrieveByEmail(email);

      if (!user) {
        return res.sendResponse(
          ApiResponse.error(400, 'Aucun employé ne correspond à cette adresse e-mail.'),
        );
      }

      const resetCode = generateRandomCode();

      const updatedUser: IUser = {
        ...user,
        reset_code: resetCode,
        updated_at: new Date(),
      };

      const result = await usersRepo.update(updatedUser);

      if (result !== true) {
        return res.sendResponse(
          ApiResponse.error(400, 'Erreur lors de la mise à jour du code de réinitialisation.'),
        );
      }

      await emailService.sendResetPasswordEmail(updatedUser.email, {
        civility: updatedUser.civility,
        lastName: updatedUser.last_name,
        code: updatedUser.reset_code,
      });

      return res.sendResponse(ApiResponse.success(201, { uid: updatedUser.uid, sent: true }));
    } catch (error) {
      logservice.error('[forgotPassword$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
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
        return res.sendResponse(
          ApiResponse.error(400, "Un employé avec cette adresse e-mail n'existe pas."),
        );
      }

      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const updatedUser: IUser = {
        ...user,
        hashed_password: hashedPassword,
        updated_at: new Date(),
      };

      const update = await usersRepo.update(updatedUser);

      if (update !== true) {
        return res.sendResponse(
          ApiResponse.error(400, "Le profil de l'utilisateur n'a pas pu être mis à jour."),
        );
      }

      const token = jwtServices.encode({ uid: updatedUser.uid });

      return res.sendResponse(ApiResponse.success(200, { token, user: updatedUser }));
    } catch (error) {
      logservice.error('[changeDefaultPassword$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Une erreur interne est survenue.'));
    }
  }

  async resetPassword(req: Request<object, object, ResetPasswordInput>, res: Response) {
    try {
      const { uid, password, reset_code } = req.body;

      const user = await usersRepo.retrieveById(uid);

      if (!user) {
        return res.sendResponse(ApiResponse.error(401, "L'utilisateur n'existe pas."));
      }

      if (user.reset_code !== reset_code) {
        return res.sendResponse(ApiResponse.error(401, 'Le code est incorrect.'));
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
        return res.sendResponse(
          ApiResponse.error(400, "Le mot de passe de l'employé n'a pas pu être modifié."),
        );
      }

      return res.sendResponse(ApiResponse.success(201, { result: true }));
    } catch (error) {
      logservice.error('[resetPassword$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
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
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur n'existe pas."));
      }

      if (!user.reset_code) {
        return res.sendResponse(
          ApiResponse.error(
            400,
            "Vous n'avez pas effectué de demande de changement de mot de passe pour que nous vous envoyions un code.",
          ),
        );
      }

      await emailService.sendResetPasswordEmail(user.email, {
        civility: user.civility,
        lastName: user.last_name,
        code: user.reset_code,
      });

      return res.sendResponse(ApiResponse.success(200, { sent: true }));
    } catch (error) {
      logservice.error('[resendPasswordCode$UsersController]', error);
      return res.sendResponse(
        ApiResponse.error(
          500,
          "Une erreur inconnue est survenue lors de la réexpédition de l'e-mail.",
        ),
      );
    }
  }

  async update(req: Request<any, object, CreateUserInput>, res: Response) {
    try {
      const admin = await usersRepo.retrieveById(req.user.uid);

      if (!admin?.is_admin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();

      const user = await usersRepo.retrieveById(trimmedUid);

      if (!user) {
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur n'existe pas."));
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
        return res.sendResponse(
          ApiResponse.error(400, "Le profil de l'utilisateur n'a pas pu être mis à jour."),
        );
      }

      const log = loggingService.createLogEntry(user.uid, LogType.PROFILE_UPDATE, {});
      await userLog.save(log);

      return res.sendResponse(
        ApiResponse.success(200, undefined, 'Profil mis à jour avec succès.'),
      );
    } catch (error) {
      logservice.error('[update$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async retrieve(req: Request, res: Response) {
    try {
      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();

      const user = await usersRepo.retrieveById(trimmedUid);

      if (!user) {
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur n'existe pas."));
      }

      return res.sendResponse(ApiResponse.success(200, user));
    } catch (error) {
      logservice.error('[retrieve$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async retrieveAll(req: Request, res: Response) {
    try {
      const admin = await usersRepo.retrieveById(req.user.uid);

      if (!admin?.is_admin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }
      const paginationParams = getPaginationParams(req.query);
      const users = await usersRepo.retrieveAll(paginationParams);

      return res.sendResponse(ApiResponse.success(200, users));
    } catch (error) {
      logservice.error('[retrieveAll$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async retrieveAllNotArchived(req: Request, res: Response) {
    try {
      const admin = await usersRepo.retrieveById(req.user.uid);

      if (!admin?.is_admin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const users = await usersRepo.retrieveAllNotArchived();

      return res.sendResponse(ApiResponse.success(200, users));
    } catch (error) {
      logservice.error('[retrieveAllNotArchived$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await usersRepo.retrieveById(req.user.uid);

      if (!user) {
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur n'existe pas."));
      }

      return res.sendResponse(ApiResponse.success(200, user));
    } catch (error) {
      logservice.error('[getUser$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async resetToDefaultPassword(req: Request, res: Response) {
    try {
      const user = await usersRepo.retrieveById(req.user.uid);

      if (!user.is_admin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();
      const userToUpdate = await usersRepo.retrieveById(trimmedUid);

      if (!userToUpdate) {
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur n'existe pas."));
      }

      const password = passwordManager.generateDefaultPassword(
        userToUpdate.last_name,
        userToUpdate.date_of_birth,
      );

      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const updatedUser: IUser = {
        ...userToUpdate,
        hashed_password: hashedPassword,
        updated_at: new Date(),
      };

      const result = await usersRepo.update(updatedUser);

      if (result !== true) {
        return res.sendResponse(
          ApiResponse.error(400, "Le profil de l'utilisateur n'a pas pu être mis à jour."),
        );
      }

      return res.sendResponse(ApiResponse.success(200, { result: true }));
    } catch (error) {
      logservice.error('[resetToDefaultPassword$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async resendWelcomeEmail(req: Request, res: Response) {
    try {
      const user = await usersRepo.retrieveById(req.user.uid);

      if (!user.is_admin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();
      const userToSendEmail = await usersRepo.retrieveById(trimmedUid);

      if (!userToSendEmail) {
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur n'existe pas."));
      }

      const password = passwordManager.generateDefaultPassword(
        userToSendEmail.last_name,
        userToSendEmail.date_of_birth,
      );

      const isDefaultPassword = await bcryptjs.compare(password, userToSendEmail.hashed_password);

      if (!isDefaultPassword) {
        return res.sendResponse(
          ApiResponse.error(400, "L'utilisateur a déjà changé son mot de passe."),
        );
      }

      await emailService.sendWelcomeEmail(userToSendEmail.email, {
        civility: userToSendEmail.civility,
        lastName: userToSendEmail.last_name,
        defaultPass: password,
      });

      const response = {
        sent: true,
      };

      return res.sendResponse(
        ApiResponse.success(200, response, "L'e-mail a été envoyé avec succès."),
      );
    } catch (error) {
      logservice.error('[resendWelcomeEmail$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }

  async archiveUser(req: Request, res: Response) {
    try {
      const user = await usersRepo.retrieveById(req.user.uid);

      if (!user.is_admin) {
        return res.sendResponse(ApiResponse.error(401, 'Accès refusé : utilisateur non autorisé'));
      }

      const { uid } = req.params as { uid: string };
      const trimmedUid = uid.trim();
      const userToArchive = await usersRepo.retrieveById(trimmedUid);

      if (!userToArchive) {
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur n'existe pas."));
      }

      if (userToArchive.is_archived) {
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur est déjà archivé."));
      }

      const result = await usersRepo.archive(trimmedUid);

      if (result !== true) {
        return res.sendResponse(ApiResponse.error(400, "L'utilisateur n'a pas pu être archivé."));
      }

      const response = {
        result: true,
      };
      return res.sendResponse(
        ApiResponse.success(200, response, "L'utilisateur a été archivé avec succès."),
      );
    } catch (error) {
      logservice.error('[archiveUser$UsersController]', error);
      return res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur.'));
    }
  }
}
