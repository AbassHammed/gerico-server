import { Router } from 'express';
import validateResource from '../middlewares/route-verif';
import { requireAuth } from '../middlewares/protected-route';
import { LeaveRequestController } from '../controllers/leaveRequest';
import { LeaveRequestBodySchema } from '../middlewares/leaveRequest.middleware';

class LeaveRequestRouter {
  router = Router();
  controller = new LeaveRequestController();

  constructor() {
    this.initRouter();
  }

  initRouter() {
    this.router.post('/', validateResource(LeaveRequestBodySchema), this.controller.create);
    this.router.get('/', requireAuth, this.controller.getAll);
    this.router.get('/status', requireAuth, this.controller.getAllByStatus);
    this.router.get('/:lid', requireAuth, this.controller.getMyRequests);
  }
}

export default new LeaveRequestRouter().router;
