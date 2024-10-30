import { Router } from 'express';
import { EmployeeController } from '../controllers/employee';
import validateResource from '../middlewares/route-verif';
import {
  changeDefaultPasswordSchema,
  createEmployeeSchema,
  forgotPasswordSchema,
  loginSchema,
} from '../middlewares/employee.middleware';
import { requireAuth } from '../middlewares/protected-route';

class EmployerRoutes {
  router = Router();
  controller = new EmployeeController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      '/create',
      requireAuth,
      validateResource(createEmployeeSchema),
      this.controller.create,
    );
    this.router.post('/login', validateResource(loginSchema), this.controller.login);
    this.router.post(
      '/forgot-password',
      validateResource(forgotPasswordSchema),
      this.controller.forgotPassword,
    );
    this.router.post(
      '/change-default-password',
      requireAuth,
      validateResource(changeDefaultPasswordSchema),
      this.controller.changeDefaultPassword,
    );
  }
}

export default new EmployerRoutes().router;
