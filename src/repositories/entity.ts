import { RowDataPacket } from 'mysql2';
import connection from '../models/connect';
import { PaginatedResult } from '../models/interface';

export class RepositoryEntity<T, U extends T & RowDataPacket> {
  protected async executePaginatedQuery(query: string, params: any[]): Promise<PaginatedResult<T>> {
    return new Promise((resolve, reject) => {
      connection.query<U[]>(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          connection.query<RowDataPacket[]>('SELECT FOUND_ROWS() as total', (err, totalRows) => {
            if (err) {
              reject(err);
            } else {
              const totalItems = (totalRows[0] as { total: number }).total;
              const totalPages = Math.ceil(totalItems / params[params.length - 2]);
              resolve({
                data: rows,
                pagination: {
                  currentPage:
                    Math.floor(params[params.length - 1] / params[params.length - 2]) + 1,
                  limit: params[params.length - 2],
                  totalPages,
                  totalItems,
                },
              });
            }
          });
        }
      });
    });
  }
}
