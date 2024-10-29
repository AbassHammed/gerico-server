import { Router } from 'express';
import { EmployeeController } from '../controllers/employee';
import validateResource from '../middlewares/route-verif';
import { createEmployeeSchema, loginSchema } from '../middlewares/employee.middleware';
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
  }
}

export default new EmployerRoutes().router;
