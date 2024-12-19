import { RowDataPacket } from 'mysql2';
import connection from '../models/connect';
import { PaginatedResult } from '../models/interface';

export class RepositoryEntity<T, U extends T & RowDataPacket> {
  protected async executePaginatedQuery(
    query: string,
    params: any[],
    countQuery: string,
    countParams: any[],
  ): Promise<PaginatedResult<T>> {
    return new Promise((resolve, reject) => {
      connection.query<U[]>(query, params, (err, rows) => {
        if (err) {
          return reject(err);
        }

        connection.query<RowDataPacket[]>(countQuery, countParams, (err, totalRows) => {
          if (err) {
            return reject(err);
          }

          const totalItems = totalRows[0].total;
          const limit = params[params.length - 2];
          const offset = params[params.length - 1];
          const totalPages = Math.ceil(totalItems / limit);

          resolve({
            data: rows,
            pagination: {
              currentPage: Math.floor(offset / limit) + 1,
              limit,
              totalPages,
              totalItems,
            },
          });
        });
      });
    });
  }
}
