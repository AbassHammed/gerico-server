import { IIssueReporter, IIssueReporterRow, IRepository } from '../models/interface';
import connection from '../models/connect';
import { ResultSetHeader } from 'mysql2';

class IssueReporterRepository implements IRepository<IIssueReporter> {
  save(t: IIssueReporter): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'INSERT INTO issues (issue_id, type, priority, subject, description, solved, issue_date) VALUES( ?, ?, ?, ?, ?, ?, ?)',
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

  retrieveAll(): Promise<IIssueReporter[]> {
    return new Promise((resolve, reject) => {
      connection.query<IIssueReporterRow[]>('SELECT * FROM issues', (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  retrieveById(id: string | number): Promise<IIssueReporter> {
    return new Promise((resolve, reject) => {
      connection.query<IIssueReporterRow[]>(
        'SELECT * FROM issues WHERE issue_id = ?',
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
        'UPDATE issues SET solved = true WHERE issue_id = ?',
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

  retrieveNotSolved(): Promise<IIssueReporter[]> {
    return new Promise((resolve, reject) => {
      connection.query<IIssueReporterRow[]>(
        'SELECT * FROM issues WHERE solved = false',
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    });
  }
}

export default new IssueReporterRepository();
