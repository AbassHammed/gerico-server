import { Request, Response } from 'express';
import {
  CreateIssueSchemaBody,
  UpdateIssueSchemaParams,
} from '../middlewares/issueReporter.middleware';
import { IIssueReporter } from '../models/interface';
import { generateId } from '../utils/misc';
import issueReporter from '../repositories/issueReporter';
import { logservice } from '../services/loggerService';

export class IssueReporterController {
  async reportIssue(req: Request<object, object, CreateIssueSchemaBody>, res: Response) {
    try {
      const newIssue: IIssueReporter = {
        ...req.body,
        issue_id: generateId(),
        issue_date: new Date(),
        solved: false,
      };

      const result = await issueReporter.save(newIssue);
      res.status(201).json({ result });
    } catch (error) {
      logservice.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getIssues(req: Request, res: Response) {
    try {
      const result = await issueReporter.retrieveAll();
      res.status(200).json({ result });
    } catch (error) {
      logservice.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async markIssueAsSolved(req: Request<UpdateIssueSchemaParams, object, object>, res: Response) {
    try {
      const { id } = req.params;

      const result = await issueReporter.solved(id);
      res.status(200).json({ result });
    } catch (error) {
      logservice.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getIssuesNotSolved(req: Request, res: Response) {
    try {
      const result = await issueReporter.retrieveNotSolved();
      res.status(200).json({ result });
    } catch (error) {
      logservice.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}
