import { Router } from 'express';
import validateResource from '../middlewares/route-verif';

import { requireAuth } from '../middlewares/protected-route';
import { PayslipController } from '../controllers/payslip';
import { createPayslipSchema } from '../middlewares/payslip.middleware';

class PayslipRoutes {
  router = Router();
  controller = new PayslipController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      '/',
      requireAuth,
      validateResource(createPayslipSchema),
      this.controller.create,
    );
    this.router.patch(
      '/:pid',
      requireAuth,
      validateResource(createPayslipSchema),
      this.controller.update,
    );
    this.router.get('/:uid', requireAuth, this.controller.getAllUserPayslips);
    this.router.get('/', requireAuth, this.controller.getAll);
    this.router.delete('/:pid', requireAuth, this.controller.delete);
  }
}

export default new PayslipRoutes().router;
