/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../services/ApiResponse';

export function responseHandler(req: Request, res: Response, next: NextFunction) {
  res.sendResponse = function <T>(response: ApiResponse<T>) {
    return this.status(response.statusCode).json(response);
  };
  next();
}
