import { Router } from 'express';
import validateResource from '../middlewares/route-verif';
import { requireAuth } from '../middlewares/protected-route';
import { LeaveRequestController } from '../controllers/leaveRequest';
import {
  LeaveRequestBodySchema,
  UpdateLeaveRequestBodyschema,
} from '../middlewares/leaveRequest.middleware';

class LeaveRequestRouter {
  router = Router();
  controller = new LeaveRequestController();

  constructor() {
    this.initRouter();
  }

  initRouter() {
    this.router.post(
      '/',
      requireAuth,
      validateResource(LeaveRequestBodySchema),
      this.controller.create,
    );
    this.router.post('/reminder', requireAuth, this.controller.leaveRequestReminder);
    this.router.get('/status', requireAuth, this.controller.getAllByStatus);
    this.router.get('/me', requireAuth, this.controller.getMyRequests);
    this.router.get('/upcoming', requireAuth, this.controller.getAllUpcoming);
    this.router.get('/upcoming/:uid', requireAuth, this.controller.getAcceptedRequestsForUser);
    this.router.get('/:lid', requireAuth, this.controller.getById);
    this.router.get('/', requireAuth, this.controller.getAll);
    this.router.patch(
      '/:lid',
      requireAuth,
      validateResource(UpdateLeaveRequestBodyschema),
      this.controller.update,
    );
    this.router.delete('/:lid', requireAuth, this.controller.deleteOne);
  }
}

export default new LeaveRequestRouter().router;
