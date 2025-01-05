/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Router } from 'express';
import { IssueReporterController } from '../controllers/issueReporter';
import validateResource from '../middlewares/route-verif';
import { createIssueSchema, updateIssueSchema } from '../middlewares/issueReporter.middleware';
import { requireAuth } from '../middlewares/protected-route';

class IssueReporterRouter {
  router = Router();
  controller = new IssueReporterController();

  constructor() {
    this.initRouter();
  }

  initRouter() {
    this.router.post('/', validateResource(createIssueSchema), this.controller.reportIssue);
    this.router.get('/', requireAuth, this.controller.getIssues);
    this.router.get('/get-not-solved', requireAuth, this.controller.getIssuesNotSolved);
    this.router.patch(
      '/:id/solved',
      requireAuth,
      validateResource(updateIssueSchema),
      this.controller.markIssueAsSolved,
    );
  }
}

export default new IssueReporterRouter().router;
