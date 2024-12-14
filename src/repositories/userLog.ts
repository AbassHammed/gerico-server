/* eslint-disable brace-style */
import {
  IRepository,
  LogEntry,
  LogEntryRowData,
  PaginatedResult,
  PaginationParams,
} from '../models/interface';
import { RepositoryEntity } from './entity';
import connection from '../models/connect';

class UserLogRepository
  extends RepositoryEntity<LogEntry, LogEntryRowData>
  implements IRepository<LogEntry>
{
  save(t: LogEntry): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO user_logs (log_id, uid, log_type, log_message, log_date) VALUES (?, ?, ?, ?, ?)',
        [t.log_id, t.uid, t.log_type, t.log_message, t.log_date],
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

  retrieveAll(params: PaginationParams): Promise<PaginatedResult<LogEntry>> {
    const query = 'SELECT * FROM user_logs ORDER BY log_date DESC LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM user_logs';
    return this.executePaginatedQuery(
      query,
      [Number(params.limit), Number(params.offset)],
      countQuery,
      [],
    );
  }

  retrieveByUserId(uid: string, params: PaginationParams): Promise<PaginatedResult<LogEntry>> {
    const query = 'SELECT * FROM user_logs WHERE uid = ? ORDER BY log_date DESC LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM user_logs WHERE uid = ?';
    return this.executePaginatedQuery(
      query,
      [uid, Number(params.limit), Number(params.offset)],
      countQuery,
      [uid],
    );
  }
}

export default new UserLogRepository();
