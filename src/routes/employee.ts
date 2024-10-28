import { Router } from 'express';
import { EmployeeController } from '../controllers/employee';
import validateResource from '../middlewares/route-verif';
import { createEmployeeSchema } from '../middlewares/employee.middleware';

class EmployerRoutes {
  router = Router();
  controller = new EmployeeController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/create', validateResource(createEmployeeSchema), this.controller.create);
  }
}

export default new EmployerRoutes().router;
