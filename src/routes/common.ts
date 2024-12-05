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
  }
}

export default new CommonRouter().router;
