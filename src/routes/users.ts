/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Router } from 'express';
import { UsersController } from '../controllers/users';
import validateResource from '../middlewares/route-verif';
import {
  changeDefaultPasswordSchema,
  createUserSchema,
  forgotPasswordSchema,
  loginSchema,
  resendResetCodeSchema,
  resetPasswordSchema,
} from '../middlewares/users.middleware';
import { requireAuth } from '../middlewares/protected-route';

class UsersRoutes {
  router = Router();
  controller = new UsersController();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/', requireAuth, validateResource(createUserSchema), this.controller.create);
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
    this.router.post(
      '/reset-password',
      validateResource(resetPasswordSchema),
      this.controller.resetPassword,
    );
    this.router.post(
      '/resend-password-code',
      validateResource(resendResetCodeSchema),
      this.controller.resendPasswordCode,
    );
    this.router.post('/resend-welcome-email/:uid', requireAuth, this.controller.resendWelcomeEmail);
    this.router.patch(
      '/:uid',
      requireAuth,
      validateResource(createUserSchema),
      this.controller.update,
    );
    this.router.patch('/archive/:uid', requireAuth, this.controller.archiveUser);
    this.router.get('/me', requireAuth, this.controller.getUser);
    this.router.get('/all', requireAuth, this.controller.retrieveAllNotArchived);
    this.router.get('/:uid', requireAuth, this.controller.retrieve);
    this.router.get('/', requireAuth, this.controller.retrieveAll);
  }
}

export default new UsersRoutes().router;
