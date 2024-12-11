import { Router } from 'express';
import { requireAuth } from '../middlewares/protected-route';
import { CommonUtils } from '../controllers/common';

class CommonRouter {
  router = Router();
  controller = new CommonUtils();

  constructor() {
    this.initRouter();
  }

  initRouter() {
    this.router.get('/thresholds', requireAuth, this.controller.retrieveThresholds);
    this.router.get('/deductions', requireAuth, this.controller.retrieveDeductions);
  }
}

export default new CommonRouter().router;
