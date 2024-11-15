import { Request, Response } from 'express';
import CompanyRepository from '../repositories/company.repo';
import userRepository from '../repositories/user.repo';
import { CompanyInfoBodyType } from '../middlewares/companyInfo.middleware';

async function checkAdmin(adminId: string) {
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
        return res.status(401).json({ error: 'You are not supposed to be here' });
      }

      const data = req.body;
      await CompanyRepository.save(data);
      res.status(201).json({ message: 'Company created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const isAdmin = await checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.status(401).json({ error: 'You are not supposed to be here' });
      }

      const { siret } = req.params;
      const company = await CompanyRepository.retrieveById(siret);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.status(200).json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request<object, object, CompanyInfoBodyType>, res: Response) {
    try {
      const isAdmin = await checkAdmin(req.user.uid);

      if (!isAdmin) {
        return res.status(401).json({ error: 'You are not supposed to be here' });
      }

      const data = req.body;
      await CompanyRepository.update(data);
      res.status(200).json({ message: 'Company updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    const isAdmin = await checkAdmin(req.user.uid);

    if (!isAdmin) {
      return res.status(401).json({ error: 'You are not supposed to be here' });
    }

    try {
      const { siret } = req.params;
      await CompanyRepository.delete(siret);
      res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
