import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ApiResponse } from '../services/ApiResponse';

const validateResource =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      return res.sendResponse(ApiResponse.error(400, e.errors));
    }
  };

export default validateResource;
