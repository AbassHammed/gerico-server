import { Request, Response } from 'express';
import {
  CreateIssueSchemaBody,
  UpdateIssueSchemaParams,
} from '../middlewares/issueReporter.middleware';
import { IIssueReporter } from '../models/interface';
import { generateId, getPaginationParams } from '../utils/misc';
import issueReporter from '../repositories/issueReporter';
import { logservice } from '../services/loggerService';
import { ApiResponse } from '../services/ApiResponse';

export class IssueReporterController {
  async reportIssue(req: Request<object, object, CreateIssueSchemaBody>, res: Response) {
    try {
      const newIssue: IIssueReporter = {
        ...req.body,
        issue_id: generateId(),
        issue_date: new Date(),
        solved: false,
      };

      await issueReporter.save(newIssue);
      return res.sendResponse(ApiResponse.success(200, undefined));
    } catch (error) {
      logservice.error('[reportIssue$IssueReporterController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }

  async getIssues(req: Request, res: Response) {
    try {
      const paginationParams = getPaginationParams(req.query);
      const result = await issueReporter.retrieveAll(paginationParams);
      res.sendResponse(ApiResponse.success(200, result));
    } catch (error) {
      logservice.error('[getIssues$IssueReporterController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }

  async markIssueAsSolved(req: Request<UpdateIssueSchemaParams, object, object>, res: Response) {
    try {
      const { id } = req.params;

      await issueReporter.solved(id.trim());
      res.sendResponse(ApiResponse.success(200));
    } catch (error) {
      logservice.error('[markIssueAsSolved$IssueReporterController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }

  async getIssuesNotSolved(req: Request, res: Response) {
    try {
      const paginationParams = getPaginationParams(req.query);
      const result = await issueReporter.retrieveNotSolved(paginationParams);
      res.sendResponse(ApiResponse.success(200, result));
    } catch (error) {
      logservice.error('[getIssuesNotSolved$IssueReporterController]', error);
      res.sendResponse(ApiResponse.error(500, 'Erreur interne du serveur'));
    }
  }
}
