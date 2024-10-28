import { ILeaveRequest, IRepository } from '../models/interface';
import connection from '../models/connect';

class LeaveRequestRepo implements Omit<IRepository<ILeaveRequest>, 'retrieveAll' | 'deleteAll'> {
  save(lr: ILeaveRequest): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO leave_requests (leave_request_id, uid, request_status, created_at, start_date, end_date, reason) VALUES(?, ?, ?, ?, ?, ?, ?)',
        [
          lr.leave_request_id,
          lr.uid,
          lr.request_status,
          lr.created_at,
          lr.start_date,
          lr.end_date,
          lr.reason,
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

  retrieveAll(uid: string): Promise<ILeaveRequest[]> {
    return new Promise((resolve, reject) => {
      connection.query<ILeaveRequest[]>(
        'SELECT * FROM leave_requests WHERE uid = ?',
        [uid],
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

  deleteAll(uid: string): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM leave_requests WHERE uid = ?', [uid], err => {
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
