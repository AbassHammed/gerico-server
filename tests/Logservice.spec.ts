/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
import { LoggingService } from '../src/services/LogService';
import { LogType } from '../src/models/interface';
import * as misc from '../src/utils/misc';
import { strict as assert } from 'assert';
import sinon from 'sinon';

describe('LoggingService', () => {
  let loggingService: LoggingService;
  let generateIdStub: sinon.SinonStub;

  before(() => {
    loggingService = new LoggingService();
  });

  beforeEach(() => {
    generateIdStub = sinon.stub(misc, 'generateId').returns('mocked-id');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should generate a log entry for PROFILE_UPDATE', () => {
    const result = loggingService.createLogEntry('user123', LogType.PROFILE_UPDATE, {
      changedFields: 'email, téléphone',
    });

    assert.deepEqual(result, {
      log_id: 'mocked-id',
      uid: 'user123',
      log_type: LogType.PROFILE_UPDATE,
      log_message: 'Votre profil a été mis à jour.',
      log_date: result.log_date, // Verify the exact date separately below
    });

    assert.ok(result.log_date instanceof Date, 'log_date should be a valid Date object');
  });

  it('should generate a log entry for LEAVE_REQUEST_PENDING', () => {
    const result = loggingService.createLogEntry('user123', LogType.LEAVE_REQUEST_PENDING, {
      startDate: '2024-12-01',
      endDate: '2024-12-10',
    });

    assert.deepEqual(result, {
      log_id: 'mocked-id',
      uid: 'user123',
      log_type: LogType.LEAVE_REQUEST_PENDING,
      log_message:
        "Votre demande de congé pour la période du 2024-12-01 au 2024-12-10 a été soumise et est en attente d'approbation.",
      log_date: result.log_date,
    });

    assert.ok(result.log_date instanceof Date);
  });

  it('should generate a log entry for LEAVE_REQUEST_REFUSED', () => {
    const result = loggingService.createLogEntry('user123', LogType.LEAVE_REQUEST_REFUSED, {
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      reason: 'Ressources insuffisantes',
    });

    assert.deepEqual(result, {
      log_id: 'mocked-id',
      uid: 'user123',
      log_type: LogType.LEAVE_REQUEST_REFUSED,
      log_message:
        'Votre demande de congé pour la période du 2024-12-01 au 2024-12-10 a été refusée. Raison : Ressources insuffisantes',
      log_date: result.log_date,
    });

    assert.ok(result.log_date instanceof Date);
  });

  it('should generate a log entry for PAYSLIP_AVAILABLE', () => {
    const result = loggingService.createLogEntry('user123', LogType.PAYSLIP_AVAILABLE, {
      period: 'Novembre 2024',
    });

    assert.deepEqual(result, {
      log_id: 'mocked-id',
      uid: 'user123',
      log_type: LogType.PAYSLIP_AVAILABLE,
      log_message:
        'Votre bulletin de paie pour la période Novembre 2024 est maintenant disponible.',
      log_date: result.log_date,
    });

    assert.ok(result.log_date instanceof Date);
  });

  it('should generate a default log entry for an unknown log type', () => {
    const result = loggingService.createLogEntry('user123', 'UNKNOWN_TYPE' as LogType, {});

    assert.deepEqual(result, {
      log_id: 'mocked-id',
      uid: 'user123',
      log_type: 'UNKNOWN_TYPE',
      log_message: 'Une action a été effectuée sur votre compte.',
      log_date: result.log_date,
    });

    assert.ok(result.log_date instanceof Date);
  });
});
