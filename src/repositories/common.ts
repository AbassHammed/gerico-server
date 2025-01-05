/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { IDeduction, IDeductionRow, ISSThreshold, ISSThresholdRow } from '../models/interface';
import connection from '../models/connect';

class PdfUtils {
  getThresholds(): Promise<ISSThreshold[]> {
    return new Promise((resolve, reject) => {
      connection.query<ISSThresholdRow[]>(
        'SELECT * FROM social_security_thresholds',
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
  getDeductions(): Promise<IDeduction[]> {
    return new Promise((resolve, reject) => {
      connection.query<IDeductionRow[]>('SELECT * FROM deductions', (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

export default new PdfUtils();
