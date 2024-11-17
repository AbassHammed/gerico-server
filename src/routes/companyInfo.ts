import { Router } from 'express';
import validateResource from '../middlewares/route-verif';
import { requireAuth } from '../middlewares/protected-route';
import { CompanyInfoController } from '../controllers/companyInfo';
import { createCompanyInfoSchema } from '../middlewares/companyInfo.middleware';

class CompanyInfoRouter {
  router = Router();
  controller = new CompanyInfoController();

  constructor() {
    this.initRouter();
  }

  initRouter() {
    this.router.post(
      '/create',
      requireAuth,
      validateResource(createCompanyInfoSchema),
      this.controller.create,
    );
    this.router.patch(
      '/update',
      requireAuth,
      validateResource(createCompanyInfoSchema),
      this.controller.update,
    );
    this.router.delete('/:siret/delete', requireAuth, this.controller.delete);
    this.router.get('/:siret', requireAuth, this.controller.getById);
  }
}

export default new CompanyInfoRouter().router;
