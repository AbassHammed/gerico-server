import { IRepository, IUser } from '../models/interface';
import connection from '../models/connect';
import { ResultSetHeader } from 'mysql2';

class UserRepository implements Required<IRepository<IUser>> {
  save(t: IUser): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'INSERT INTO users (uid, first_name, last_name, phone_number, email, password, hire_date, created_at, user_post, updated_at, departure_date, is_admin, is_archived, reset_code) VALUES(?, ?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          t.uid,
          t.first_name,
          t.last_name,
          t.phone_number,
          t.email,
          t.password,
          t.hire_date,
          t.created_at,
          t.user_post,
          t.updated_at,
          t.departure_date,
          t.is_admin,
          t.is_archived,
          t.reset_code,
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
      connection.query<IUser[]>('SELECT * FROM users', (err, res) => {
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
      connection.query<IUser[]>('SELECT * FROM users WHERE uid = ?', [id], (err, res) => {
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
      connection.query<IUser[]>('SELECT * FROM users WHERE email = ?', [email], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res?.[0]);
        }
      });
    });
  }

  update(t: IUser): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE users SET first_name = ?, last_name = ?, phone_number = ?, email = ?, password = ?, hire_date = ?, created_at = ?, user_post = ?, updated_at = ?, departure_date = ?, is_admin = ?, is_archived = ?, reset_code = ? WHERE uid = ?',
        [
          t.first_name,
          t.last_name,
          t.phone_number,
          t.email,
          t.password,
          t.hire_date,
          t.created_at,
          t.user_post,
          t.updated_at,
          t.departure_date,
          t.is_admin,
          t.is_archived,
          t.reset_code,
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
        'UPDATE users SET is_archived = true WHERE uid = ?',
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
