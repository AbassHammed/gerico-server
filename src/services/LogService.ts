import { LogType, LogEntry } from '../models/interface';
import { generateId } from '../utils/misc';

type LogParamsMap = {
  [LogType.PROFILE_UPDATE];
  [LogType.LEAVE_REQUEST_PENDING]: { startDate: string; endDate: string };
  [LogType.LEAVE_REQUEST_ACCEPTED]: { startDate: string; endDate: string };
  [LogType.LEAVE_REQUEST_REFUSED]: { startDate: string; endDate: string; reason: string };
  [LogType.PAYSLIP_AVAILABLE]: { period: string };
};

type DefaultParams = Record<string, string>;

export class LoggingService {
  private logTemplates = {
    [LogType.PROFILE_UPDATE]: () => `Votre profil a été mis à jour.`,
    [LogType.LEAVE_REQUEST_PENDING]: ({
      startDate,
      endDate,
    }: LogParamsMap[LogType.LEAVE_REQUEST_PENDING]) =>
      `Votre demande de congé pour la période du ${startDate} au ${endDate} a été soumise et est en attente d'approbation.`,
    [LogType.LEAVE_REQUEST_ACCEPTED]: ({
      startDate,
      endDate,
    }: LogParamsMap[LogType.LEAVE_REQUEST_ACCEPTED]) =>
      `Votre demande de congé pour la période du ${startDate} au ${endDate} a été acceptée.`,
    [LogType.LEAVE_REQUEST_REFUSED]: ({
      startDate,
      endDate,
      reason,
    }: LogParamsMap[LogType.LEAVE_REQUEST_REFUSED]) =>
      `Votre demande de congé pour la période du ${startDate} au ${endDate} a été refusée. Raison : ${reason}`,
    [LogType.PAYSLIP_AVAILABLE]: ({ period }: LogParamsMap[LogType.PAYSLIP_AVAILABLE]) =>
      `Votre bulletin de paie pour la période ${period} est maintenant disponible.`,
    DEFAULT: () => 'Une action a été effectuée sur votre compte.',
  };

  private generateLogMessage<T extends LogType>(
    logType: T,
    params: LogParamsMap[T] | DefaultParams,
  ): string {
    const template = this.logTemplates[logType] || this.logTemplates.DEFAULT;
    return template(params as any);
  }

  public createLogEntry<T extends LogType>(
    uid: string,
    logType: T,
    params: LogParamsMap[T],
  ): LogEntry {
    return {
      log_id: generateId(),
      uid,
      log_type: logType,
      log_message: this.generateLogMessage(logType, params),
      log_date: new Date(),
      is_read: false,
    };
  }
}

export default new LoggingService();
