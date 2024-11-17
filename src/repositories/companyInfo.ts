import { ICompanyInfo, ICompanyInfoRowData, IRepository } from '../models/interface';
import connection from '../models/connect';

class CompanyInfoRepository implements IRepository<ICompanyInfo> {
  save(data: ICompanyInfo): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO company_info (siret, code_ape, name, address_line1, address_line2, city, postal_code, country, collective_convention) VALUES( ?,?,?,?,?,?,?,?,?)',
        [
          data.siret,
          data.code_ape,
          data.name,
          data.address_line1,
          data.address_line2,
          data.city,
          data.postal_code,
          data.country,
          data.collective_convention,
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

  retrieveById(siret: string | number): Promise<ICompanyInfo> {
    return new Promise((resolve, reject) => {
      connection.query<ICompanyInfoRowData[]>(
        'SELECT * FROM company_info WHERE siret = ?',
        [siret],
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

  update(data: ICompanyInfo): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE company_info SET code_ape = ?, name = ?, address_line1 = ?, address_line2 = ?, city = ?, postal_code = ?, country = ?, collective_convention = ? WHERE siret = ?',
        [
          data.code_ape,
          data.name,
          data.address_line1,
          data.address_line2,
          data.city,
          data.postal_code,
          data.country,
          data.collective_convention,
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

  delete(siret: string | number): Promise<true> {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM company_info WHERE siret = ?', [siret], err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export default new CompanyInfoRepository();
