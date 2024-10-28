/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { CreateUserInput } from '../middlewares/user.middleware';
import userRepo from '../repositories/user';
import bcryptjs from 'bcryptjs';

export class UserController {
  async create(req: Request<object, object, CreateUserInput>, res: Response) {
    try {
      const { email, last_name, first_name, phone_number, user_post, hire_date } = req.body;

      const withEmail = await userRepo.retrieveByEmail(email);

      if (withEmail) {
        return res.status(400).json({ error: 'The email already is already used' });
      }

      // in the future we would have a nested try-catch here for proper error handling

      const salt = await bcryptjs.genSalt();
    } catch (error) {
      //
    }
  }
}
