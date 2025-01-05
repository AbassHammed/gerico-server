/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
