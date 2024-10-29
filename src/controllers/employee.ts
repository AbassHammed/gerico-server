import { Request, Response } from 'express';
import { CreateEmployeeInput, LoginInput } from '../middlewares/employee.middleware';
import employeeRepo from '../repositories/employee';
import bcryptjs from 'bcryptjs';
import passwordManager from '../services/passwordManager';
import { IEmployee } from '../models/interface';
import { generateUUIDv4 } from '../utils/misc';
import { logservice } from '../services/loggerService';
import jwtServices from '../services/jwtServices';

/**
 * 200 OK - La requête a réussi, et la réponse contient les données demandées.
 * 201 Created - La ressource a été créée avec succès suite à la requête.
 * 204 No Content - La requête a réussi, mais il n'y a pas de contenu à renvoyer.
 * 400 Bad Request - La requête est mal formée ou contient des données invalides.
 * 401 Unauthorized - La requête nécessite une authentification qui a échoué ou est manquante.
 * 403 Forbidden - La requête est comprise, mais l’accès est refusé par le serveur.
 * 404 Not Found - La ressource demandée est introuvable sur le serveur.
 * 409 Conflict - La requête ne peut pas être complétée en raison d'un conflit avec l'état actuel de la ressource.
 * 500 Internal Server Error - Une erreur inattendue s'est produite côté serveur.
 * 502 Bad Gateway - Le serveur a reçu une réponse invalide d’un autre serveur en amont.
 * 503 Service Unavailable - Le serveur est temporairement indisponible, généralement pour maintenance.
 *
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */

export class EmployeeController {
  async create(req: Request<object, object, CreateEmployeeInput>, res: Response) {
    try {
      const { email, last_name, dob, hire_date } = req.body;

      const withEmail = await employeeRepo.retrieveByEmail(email);

      if (withEmail) {
        return res.status(400).json({ error: 'The email already is already used' });
      }

      const dateOfBirth = new Date(dob);

      const hireDate = new Date(hire_date);

      // in the future we would have a nested try-catch here for proper error handling
      const password = passwordManager.generateDefaultPassword(last_name, dateOfBirth);

      const salt = await bcryptjs.genSalt();

      const hashedPassword = await bcryptjs.hash(password, salt);

      const newEmployee: IEmployee = {
        ...req.body,
        dob: dateOfBirth,
        hire_date: hireDate,
        uid: generateUUIDv4(),
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        is_archived: false,
        reset_code: null,
        departure_date: null,
      };

      const result = await employeeRepo.save(newEmployee);

      if (result !== true) {
        return res
          .status(401)
          .json({ error: 'An error occured while creating the user, please try again' });
      }
      // TODO: implement email services then send an email to the employee
      res.status(201).json({ message: 'The employee was successfully created.' });
    } catch (error) {
      logservice.info(error);

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request<object, object, LoginInput>, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await employeeRepo.retrieveByEmail(email);

      if (!user) {
        return res
          .status(400)
          .json({ error: 'No user with the email provided.', code: 'ENOTFOUND' });
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Incorrect password', code: 'EINCPASS' });
      }

      const isdefaultPassword = passwordManager.isDefaultPattern(password);

      if (isdefaultPassword) {
        return res.status(208).json({ code: 'DEFAULTPASS' });
      }

      const token = jwtServices.encode({ uid: user.uid });
      res.status(200).json({ token });
    } catch (error) {
      logservice.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
