import { IRepository, IUser, IUserRowData } from '../models/interface';
import connection from '../models/connect';
import { ResultSetHeader } from 'mysql2';

class UserRepository implements Required<IRepository<IUser>> {
  save(t: IUser): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'INSERT INTO users (uid, civility, first_name, last_name, email, phone_number, hashed_password, job, job_department, is_admin, hire_date, created_at, updated_at, departure_date, is_archived, reset_code, address_line1, address_line2, city,  postal_code, country, date_of_birth, social_security_number, remaining_leave_balance, contract_type, marital_status, dependants, company_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          t.uid,
          t.civility,
          t.first_name,
          t.last_name,
          t.email,
          t.phone_number,
          t.hashed_password,
          t.job_title,
          t.job_department,
          t.is_admin,
          t.hire_date,
          t.created_at,
          t.updated_at,
          t.departure_date,
          t.is_archived,
          t.reset_code,
          t.address_line1,
          t.address_line2,
          t.city,
          t.postal_code,
          t.country,
          t.date_of_birth,
          t.social_security_number,
          t.remaining_leave_balance,
          t.contract_type,
          t.marital_status,
          t.dependants,
          t.company_id,
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

  retrieveAll(): Promise<IUser[]> {
    return new Promise((resolve, reject) => {
      connection.query<IUserRowData[]>('SELECT * FROM users', (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  retrieveById(id: string | number): Promise<IUser> {
    return new Promise((resolve, reject) => {
      connection.query<IUserRowData[]>('SELECT * FROM users WHERE uid = ?', [id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res?.[0]);
        }
      });
    });
  }

  retrieveByEmail(email: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      connection.query<IUserRowData[]>(
        'SELECT * FROM users WHERE email = ?',
        [email],
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

  update(t: IUser): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE users SET civility = ?, first_name = ?, last_name = ?, email = ?, phone_number = ?, hashed_password = ?, job = ?, job_department = ?, is_admin = ?, hire_date = ?, created_at = ?, updated_at = ?, departure_date = ?, is_archived = ?, reset_code = ?, address_line1 = ?, address_line2 = ?, city = ?, postal_code = ?, country = ?, date_of_birth = ?, social_security_number = ?, remaining_leave_balance = ?, contract_type = ?, marital_status = ?, dependants = ?, company_id = ? WHERE uid = ?',
        [
          t.civility,
          t.first_name,
          t.last_name,
          t.email,
          t.phone_number,
          t.hashed_password,
          t.job_title,
          t.job_department,
          t.is_admin,
          t.hire_date,
          t.created_at,
          t.updated_at,
          t.departure_date,
          t.is_archived,
          t.reset_code,
          t.address_line1,
          t.address_line2,
          t.city,
          t.postal_code,
          t.country,
          t.date_of_birth,
          t.social_security_number,
          t.remaining_leave_balance,
          t.contract_type,
          t.marital_status,
          t.dependants,
          t.company_id,
          t.uid,
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

  delete(id: string | number): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('DELETE FROM users WHERE uid = ?', [id], err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  archive(id: string | number): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE employees SET is_archived = true WHERE uid = ?',
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

  deleteAll(): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('DELETE FROM users', err => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
      });
    });
  }
}

export default new UserRepository();
