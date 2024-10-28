import { IEmployee, IRepository } from '../models/interface';
import connection from '../models/connect';
import { ResultSetHeader } from 'mysql2';

class EmployeeRepository implements Required<IRepository<IEmployee>> {
  save(t: IEmployee): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'INSERT INTO employees (uid, civility, first_name, last_name, email, phone_number, password, employee_post, is_admin, hire_date, created_at, updated_at, departure_date, is_archived, reset_code, address_line1, address_line2, city, state, postal_code, country, dob, ss_number, work_hours_month, contrat_type, marital_status, dependents) VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          t.uid,
          t.civility,
          t.first_name,
          t.last_name,
          t.email,
          t.phone_number,
          t.password,
          t.employee_post,
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
          t.state,
          t.postal_code,
          t.country,
          t.dob,
          t.ss_number,
          t.work_hours_month,
          t.contrat_type,
          t.marital_status,
          t.dependents,
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

  retrieveAll(): Promise<IEmployee[]> {
    return new Promise((resolve, reject) => {
      connection.query<IEmployee[]>('SELECT * FROM employees', (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  retrieveById(id: string | number): Promise<IEmployee> {
    return new Promise((resolve, reject) => {
      connection.query<IEmployee[]>('SELECT * FROM employees WHERE uid = ?', [id], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res?.[0]);
        }
      });
    });
  }

  retrieveByEmail(email: string): Promise<IEmployee> {
    return new Promise((resolve, reject) => {
      connection.query<IEmployee[]>(
        'SELECT * FROM employees WHERE email = ?',
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

  update(t: IEmployee): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE employees SET civility = ?, first_name = ?, last_name = ?, email = ?, phone_number = ?, password = ?, employee_post = ?, is_admin = ?, hire_date = ?, created_at = ?, updated_at = ?, departure_date = ?, is_archived = ?, reset_code = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?, country = ?, dob = ?, ss_number = ?, work_hours_month = ?, contrat_type = ?, marital_status = ?, dependents = ? WHERE uid = ?',
        [
          t.civility,
          t.first_name,
          t.last_name,
          t.email,
          t.phone_number,
          t.password,
          t.employee_post,
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
          t.state,
          t.postal_code,
          t.country,
          t.dob,
          t.ss_number,
          t.work_hours_month,
          t.contrat_type,
          t.marital_status,
          t.dependents,
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
      connection.query<ResultSetHeader>('DELETE FROM employees WHERE uid = ?', [id], err => {
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
      connection.query<ResultSetHeader>('DELETE FROM employees', err => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
      });
    });
  }
}

export default new EmployeeRepository();
