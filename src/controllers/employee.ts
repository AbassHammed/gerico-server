/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { CreateEmployeeInput } from '../middlewares/user.middleware';
import employeeRepo from '../repositories/employee';
import bcryptjs from 'bcryptjs';
import passwordManager from '../services/passwordManager';
import { IEmployee } from '../models/interface';
import { generateUUIDv4 } from '../utils/misc';

export class EmployeeController {
  async create(req: Request<object, object, CreateEmployeeInput>, res: Response) {
    try {
      const { email, last_name, dob } = req.body;

      const withEmail = await employeeRepo.retrieveByEmail(email);

      if (withEmail) {
        return res.status(400).json({ error: 'The email already is already used' });
      }

      // in the future we would have a nested try-catch here for proper error handling
      const password = passwordManager.generateDefaultPassword(last_name, dob);
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newEmployee: IEmployee = {
        ...req.body,
        uid: generateUUIDv4(),
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
        is_archived: false,
        reset_code: null,
      };

      const result = await employeeRepo.save(newEmployee);

      if (result !== true) {
        return res
          .status(401)
          .json({ error: 'An error occured while creating the user, please try again' });
      }
    } catch (error) {
      //
    }
  }
}
