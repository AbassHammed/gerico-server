import { Request, Response } from 'express';
import { ApiResponse } from '../services/ApiResponse';
import { logservice } from '../services/loggerService';
import { checkAdmin } from './companyInfo';
import LeaveRequestRepo from '../repositories/leaveRequest';
import {
  LeaveRequestBodyType,
  UpdateLeaveRequestBodyType,
} from '../middlewares/leaveRequest.middleware';
import { ILeaveRequest, LogType } from '../models/interface';
import { generateId, getPaginationParams } from '../utils/misc';
import loggingService from '../services/LogService';
import userLog from '../repositories/userLog';

export class LeaveRequestController {
  async create(req: Request<object, object, LeaveRequestBodyType>, res: Response) {
    try {
      const start_date = new Date(req.body.start_date);
      const end_date = new Date(req.body.end_date);

      const leaveRequest: ILeaveRequest = {
        ...req.body,
        start_date,
        end_date,
        leave_request_id: generateId(),
        created_at: new Date(),
      };

      await LeaveRequestRepo.save(leaveRequest);
      const logEntry = loggingService.createLogEntry(
        leaveRequest.uid,
        LogType.LEAVE_REQUEST_PENDING,
        {
          startDate: leaveRequest.start_date.toLocaleDateString(),
          endDate: leaveRequest.end_date.toLocaleDateString(),
        },
      );
      await userLog.save(logEntry);
      return res.sendResponse(
        ApiResponse.success(200, undefined, 'Votre demande de congé a été ajoutée avec succès'),
      );
    } catch (error) {
      logservice.error('[create$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const paginatedParams = getPaginationParams(req.query);
      const leaveRequests = await LeaveRequestRepo.retrieveAll(paginatedParams);
      return res.sendResponse(ApiResponse.success(200, leaveRequests));
    } catch (error) {
      logservice.error('[getAll$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async getAllUpcoming(req: Request, res: Response) {
    try {
      const leaveRequests = await LeaveRequestRepo.retrieveAllUpcoming();
      return res.sendResponse(ApiResponse.success(200, leaveRequests));
    } catch (error) {
      logservice.error('[getAllUpcoming$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async getMyRequests(req: Request, res: Response) {
    try {
      const { status } = req.query as { status: string };
      const paginatedParams = getPaginationParams(req.query);
      const { uid } = req.user;
      const leaveRequests = await LeaveRequestRepo.retrieveByUserId(
        uid.trim(),
        paginatedParams,
        status,
      );
      return res.sendResponse(ApiResponse.success(200, leaveRequests));
    } catch (error) {
      logservice.error('[getMyRequests$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async getAcceptedRequestsForUser(req: Request, res: Response) {
    try {
      const { uid } = req.params;
      const leaveRequests = await LeaveRequestRepo.retrieveUpcomingByUserId(uid.trim());
      return res.sendResponse(ApiResponse.success(200, leaveRequests));
    } catch (error) {
      logservice.error('[getAcceptedRequestsForUser$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async getAllByStatus(req: Request, res: Response) {
    try {
      const { status } = req.query as { status: string };
      const paginatedParams = getPaginationParams(req.query);
      const leaveRequests = await LeaveRequestRepo.retrieveByStatus(status, paginatedParams);
      return res.sendResponse(ApiResponse.success(200, leaveRequests));
    } catch (error) {
      logservice.error('[getAllByStatus$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { lid } = req.params;
      const leaveRequest = await LeaveRequestRepo.retrieveById(lid.trim());
      if (!leaveRequest) {
        return res.sendResponse(
          ApiResponse.error(
            404,
            `Nous n'avons pas pu trouver la demande de congé que vous recherchez`,
          ),
        );
      }
      return res.sendResponse(ApiResponse.success(200, leaveRequest));
    } catch (error) {
      logservice.error('[getById$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async updateStatus(req: Request, res: Response) {
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
      await LeaveRequestRepo.updateStatus(data);
      return res.sendResponse(
        ApiResponse.success(200, undefined, 'Le statut de la demande de congé a été mis à jour'),
      );
    } catch (error) {
      logservice.error('[updateStatus$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async update(req: Request<object, object, UpdateLeaveRequestBodyType>, res: Response) {
    try {
      const start_date = new Date(req.body.start_date);
      const end_date = new Date(req.body.end_date);
      const created_at = new Date(req.body.created_at);

      const leaveRequest: ILeaveRequest = {
        ...req.body,
        start_date,
        end_date,
        created_at,
      };

      await LeaveRequestRepo.update(leaveRequest);
      return res.sendResponse(
        ApiResponse.success(200, undefined, 'La demande de congé a été mise à jour avec succès'),
      );
    } catch (error) {
      logservice.error('[update$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const { lid } = req.params;
      await LeaveRequestRepo.delete(lid.trim());
      return res.sendResponse(
        ApiResponse.success(200, undefined, 'La demande de congé a été supprimée avec succès'),
      );
    } catch (error) {
      logservice.error('[deleteOne$LeaveRequestController]', error);
      return res.sendResponse(ApiResponse.error(500, error.message));
    }
  }
}
