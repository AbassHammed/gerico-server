/* eslint-disable brace-style */
import {
  IPayslip,
  IPayslipRow,
  IRepository,
  PaginatedResult,
  PaginationParams,
} from '../models/interface';
import connection from '../models/connect';
import { RepositoryEntity } from './entity';

class PayslipRepository
  extends RepositoryEntity<IPayslip, IPayslipRow>
  implements IRepository<IPayslip>
{
  save(t: IPayslip): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO pay_slips (pid, uid, gross_salary, net_salary, start_period, end_period, pay_date, total_hours_worked, hourly_rate, path_to_pdf) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.pid,
          t.uid,
          t.gross_salary,
          t.net_salary,
          t.start_period,
          t.end_period,
          t.pay_date,
          t.total_hours_worked,
          t.hourly_rate,
          t.path_to_pdf,
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

  async retrieveAll(params: PaginationParams): Promise<PaginatedResult<IPayslip>> {
    const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM pay_slips LIMIT ? OFFSET ?';
    return this.executePaginatedQuery(query, [params.limit, params.offset]);
  }

  async retrieveByUser(uid: string, params: PaginationParams): Promise<PaginatedResult<IPayslip>> {
    const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM pay_slips WHERE uid = ? LIMIT ? OFFSET ?';
    return this.executePaginatedQuery(query, [uid, params.limit, params.offset]);
  }

  retrieveById(id: string | number): Promise<IPayslip> {
    return new Promise((resolve, reject) => {
      connection.query<IPayslipRow[]>('SELECT * FROM pay_slips WHERE pid = ?', [id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res?.[0]);
        }
      });
    });
  }

  update(t: IPayslip): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE pay_slips SET gross_salary = ?, net_salary = ?, start_period = ?, end_period = ?, pay_date = ?, total_hours_worked = ?, hourly_rate = ?, path_to_pdf = ? WHERE pid = ?',
        [
          t.gross_salary,
          t.net_salary,
          t.start_period,
          t.end_period,
          t.pay_date,
          t.total_hours_worked,
          t.hourly_rate,
          t.path_to_pdf,
          t.pid,
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
}

export default new PayslipRepository();