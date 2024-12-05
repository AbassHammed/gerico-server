import { ISSThresholds, ISSThresholdsRow } from '../models/interface';
import connection from '../models/connect';

class PdfUtils {
  getThresholds(): Promise<ISSThresholds[]> {
    return new Promise((resolve, reject) => {
      connection.query<ISSThresholdsRow[]>(
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
}

export default new PdfUtils();
