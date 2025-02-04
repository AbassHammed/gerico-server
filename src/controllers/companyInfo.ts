/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Request, Response } from 'express';
import CompanyRepository from '../repositories/companyInfo';
import userRepository from '../repositories/users';
import { CompanyInfoBodyType } from '../middlewares/companyInfo.middleware';
import { logservice } from '../services/loggerService';
import { ApiResponse } from '../services/ApiResponse';

export async function checkAdmin(adminId: string) {
  const admin = await userRepository.retrieveById(adminId);

  if (!admin || !admin.is_admin) {
    return false;
  }

  return true;
}

export class CompanyInfoController {
  async create(req: Request<object, object, CompanyInfoBodyType>, res: Response) {
    try {
      const isAdmin = await checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(
          ApiResponse.error(
            401,
            `Vous avez essayé d'acccéder à une page qui nécéssite des droits adminstrateurs`,
          ),
        );
      }

      const data = req.body;
      await CompanyRepository.save(data);
      return res.sendResponse(
        ApiResponse.success(200, undefined, 'Votre entreprise a été ajoutée avec succès'),
      );
    } catch (error) {
      logservice.error('[create$CompanyInfoController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const isAdmin = await checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(
          ApiResponse.error(
            401,
            `Vous avez essayé d'acccéder à une page qui nécéssite des droits adminstrateurs`,
          ),
        );
      }

      const { siret } = req.params;
      const company = await CompanyRepository.retrieveById(siret);
      if (!company) {
        return res.sendResponse(
          ApiResponse.error(404, `Nous n'avons pas pu trouver l'entreprise que vous recherchez`),
        );
      }
      return res.sendResponse(ApiResponse.success(200, company));
    } catch (error) {
      logservice.error('[getById$CompanyInfoController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async getCompanyFromUser(req: Request, res: Response) {
    try {
      const admin = await userRepository.retrieveById(req.user.uid);

      if (!admin.is_admin) {
        return res.sendResponse(
          ApiResponse.error(
            401,
            `Vous avez essayé d'acccéder à une page qui nécéssite des droits adminstrateurs`,
          ),
        );
      }

      const company = await CompanyRepository.retrieveById(admin.company_id);
      if (!company) {
        return res.sendResponse(
          ApiResponse.error(404, `Nous n'avons pas pu trouver l'entreprise que vous recherchez`),
        );
      }
      return res.sendResponse(ApiResponse.success(200, company));
    } catch (error) {
      logservice.error('[getCompanyFromUser$CompanyInfoController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async update(req: Request<object, object, CompanyInfoBodyType>, res: Response) {
    try {
      const isAdmin = await checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.sendResponse(
          ApiResponse.error(
            401,
            `Vous avez essayé d'acccéder à une page qui nécéssite des droits adminstrateurs`,
          ),
        );
      }

      const data = req.body;
      await CompanyRepository.update(data);

      return res.sendResponse(
        ApiResponse.success(
          200,
          undefined,
          `Les informations de l'entreprise ont été mise à jour avec succès`,
        ),
      );
    } catch (error) {
      logservice.error('[update$CompanyInfoController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async delete(req: Request, res: Response) {
    const isAdmin = await checkAdmin(req.user.uid);

    if (!isAdmin) {
      return res.sendResponse(
        ApiResponse.error(
          401,
          `Vous avez essayé d'acccéder à une page qui nécéssite des droits adminstrateurs`,
        ),
      );
    }

    try {
      const { siret } = req.params;
      await CompanyRepository.delete(siret);
      res.sendResponse(
        ApiResponse.success(
          200,
          undefined,
          `Les informations de l'entreprise ont été supprimée de notre base de données avec succès`,
        ),
      );
    } catch (error) {
      logservice.error('[delete$CompanyInfoController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }
}
