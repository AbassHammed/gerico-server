import { Router } from 'express';
import { requireAuth } from '../middlewares/protected-route';
import { UserLogController } from '../controllers/userLog';

class UserLogRouter {
  router = Router();
  controller = new UserLogController();

  constructor() {
    this.initRouter();
  }

  initRouter() {
    this.router.get('/', requireAuth, this.controller.getLogs);
    this.router.get('/:uid', requireAuth, this.controller.getUserLogs);
  }
}

export default new UserLogRouter().router;
