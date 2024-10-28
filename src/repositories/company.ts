import { ICompany, IRepository } from '../models/interface';
import connection from '../models/connect';

class CompanyRepository implements IRepository<ICompany> {
  save(data: ICompany): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO company (siret, code_ape, name, addr_line1, addr_line2, city, state, postal_code, country, convention_collective) VALUES( ?,?,?,?,?,?,?,?,?,?)',
        [
          data.siret,
          data.code_ape,
          data.name,
          data.addr_line1,
          data.addr_line2,
          data.city,
          data.state,
          data.postal_code,
          data.country,
          data.convention_collective,
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

  retrieveById(siret: string | number): Promise<ICompany> {
    return new Promise((resolve, reject) => {
      connection.query<ICompany[]>('SELECT * FROM company WHERE siret = ?', [siret], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res?.[0]);
        }
      });
    });
  }

  update(data: ICompany): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE company SET code_ape = ?, name = ?, addr_line1 = ?, addr_line2 = ?, city = ?, state = ?, postal_code = ?, country = ?, convention_collective = ? WHERE siret = ?',
        [
          data.code_ape,
          data.name,
          data.addr_line1,
          data.addr_line2,
          data.city,
          data.state,
          data.postal_code,
          data.country,
          data.convention_collective,
          data.siret,
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

export default new CompanyRepository();
