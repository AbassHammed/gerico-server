/* eslint-disable brace-style */
import {
  ILeaveRequest,
  ILeaveRequestRowData,
  IRepository,
  PaginatedResult,
  PaginationParams,
} from '../models/interface';
import connection from '../models/connect';
import { RepositoryEntity } from './entity';

class LeaveRequestRepo
  extends RepositoryEntity<ILeaveRequest, ILeaveRequestRowData>
  implements IRepository<ILeaveRequest>
{
  save(lr: ILeaveRequest): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO leave_requests (leave_request_id, uid, request_status, created_at, start_date, end_date, reason, leave_type) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
        [
          lr.leave_request_id,
          lr.uid,
          lr.request_status,
          lr.created_at,
          lr.start_date,
          lr.end_date,
          lr.reason,
          lr.leave_type,
        ],

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

  retrieveAll(params: PaginationParams): Promise<PaginatedResult<ILeaveRequest>> {
    const query = 'SELECT * FROM leave_requests ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const countQuery = 'SELECT COUNT(*) as total FROM leave_requests';
    return this.executePaginatedQuery(
      query,
      [Number(params.limit), Number(params.offset)],
      countQuery,
      [],
    );
  }

  retrieveById(id: string | number): Promise<ILeaveRequest> {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM leave_requests WHERE leave_request_id = ?',
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res[0]);
          }
        },
      );
    });
  }

  retrieveByUserId(
    uid: string,
    params: PaginationParams,
    status?: string,
  ): Promise<PaginatedResult<ILeaveRequest>> {
    let query = 'SELECT * FROM leave_requests WHERE uid = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM leave_requests WHERE uid = ?';
    const queryParams: (string | number)[] = [uid];
    const countQueryParams: (string | number)[] = [uid];

    if (status) {
      query += ' AND request_status = ?';
      countQuery += ' AND request_status = ?';
      queryParams.push(String(status));
      countQueryParams.push(String(status));
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(Number(params.limit), Number(params.offset));

    return this.executePaginatedQuery(query, queryParams, countQuery, countQueryParams);
  }

  retrieveUpcomingByUserId(uid: string): Promise<ILeaveRequest[]> {
    const query =
      'SELECT * FROM leave_requests WHERE uid = ? AND end_date > NOW() AND request_status = ?';
    const queryParams: (string | number)[] = [uid, 'approved'];

    return new Promise((resolve, reject) => {
      connection.query<ILeaveRequestRowData[]>(query, queryParams, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  retrieveAllUpcoming(): Promise<ILeaveRequest[]> {
    const query = 'SELECT * FROM leave_requests WHERE end_date > NOW() AND request_status = ?';
    const queryParams: (string | number)[] = ['approved'];

    return new Promise((resolve, reject) => {
      connection.query<ILeaveRequestRowData[]>(query, queryParams, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  retrieveByStatus(
    status: string | undefined,
    params: PaginationParams,
  ): Promise<PaginatedResult<ILeaveRequest>> {
    let query = 'SELECT * FROM leave_requests';
    let countQuery = 'SELECT COUNT(*) as total FROM leave_requests';
    const queryParams: (string | number)[] = [];
    const countQueryParams: (string | number)[] = [];

    if (status) {
      query += ' WHERE request_status = ?';
      countQuery += ' WHERE request_status = ?';
      queryParams.push(status);
      countQueryParams.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(Number(params.limit), Number(params.offset));

    return this.executePaginatedQuery(query, queryParams, countQuery, countQueryParams);
  }

  updateStatus(t: ILeaveRequest): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE leave_requests SET request_status = ? WHERE leave_request_id = ?',
        [t.request_status, t.leave_request_id],
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

  update(t: ILeaveRequest): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE leave_requests SET start_date = ?, end_date = ?, reason = ?, leave_type = ?, request_status = ? WHERE leave_request_id = ?',
        [t.start_date, t.end_date, t.reason, t.leave_type, t.request_status, t.leave_request_id],
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

  delete(id: string | number): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM leave_requests WHERE leave_request_id = ?', [id], err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export default new LeaveRequestRepo();
