/* eslint-disable brace-style */
import {
  IIssueReporter,
  IIssueReporterRow,
  IRepository,
  PaginatedResult,
  PaginationParams,
} from '../models/interface';
import connection from '../models/connect';
import { ResultSetHeader } from 'mysql2';
import { RepositoryEntity } from './entity';

class IssueReporterRepository
  extends RepositoryEntity<IIssueReporter, IIssueReporterRow>
  implements IRepository<IIssueReporter>
{
  save(t: IIssueReporter): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'INSERT INTO issue_reports (issue_id, issue_type, priority, subject, message, solved, issue_date) VALUES( ?, ?, ?, ?, ?, ?, ?)',
        [t.issue_id, t.type, t.priority, t.subject, t.description, t.solved, t.issue_date],
        err => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        },
      );
    });
  }

  retrieveAll(params: PaginationParams): Promise<PaginatedResult<IIssueReporter>> {
    const query = 'SELECT * FROM issue_reports LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM issue_reports';
    return this.executePaginatedQuery(
      query,
      [Number(params.limit), Number(params.offset)],
      countQuery,
      [],
    );
  }

  retrieveById(id: string | number): Promise<IIssueReporter> {
    return new Promise((resolve, reject) => {
      connection.query<IIssueReporterRow[]>(
        'SELECT * FROM issue_reports WHERE issue_id = ?',
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res?.[0]);
          }
        },
      );
    });
  }

  solved(id: string): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE issue_reports SET solved = true WHERE issue_id = ?',
        [id],
        err => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        },
      );
    });
  }

  retrieveNotSolved(params: PaginationParams): Promise<PaginatedResult<IIssueReporter>> {
    const query = 'SELECT * FROM issue_reports WHERE solved = false LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM issue_reports WHERE solved = false';
    return this.executePaginatedQuery(
      query,
      [Number(params.limit), Number(params.offset)],
      countQuery,
      [],
    );
  }
}

export default new IssueReporterRepository();
