/* eslint-disable no-control-regex */
import { logservice } from '../src/services/loggerService';
import sinon from 'sinon';
import assert from 'assert';

describe('ConsoleLogger', () => {
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, 'log');
  });

  afterEach(() => {
    consoleLogStub.restore();
  });

  describe('trace', () => {
    it('should log message with trace color code', () => {
      logservice.trace('Test trace message');
      assert(consoleLogStub.calledOnce);
      assert(consoleLogStub.calledWithMatch(/\x1b\[90m.*\[Gérico.*\]/, 'Test trace message'));
    });
  });

  describe('debug', () => {
    it('should call trace with debug message', () => {
      logservice.debug('Test debug message');
      assert(consoleLogStub.calledOnce);
      assert(consoleLogStub.calledWithMatch(/\x1b\[90m.*\[Gérico.*\]/, 'Test debug message'));
    });
  });

  describe('info', () => {
    it('should call trace with info message', () => {
      logservice.info('Test info message');
      assert(consoleLogStub.calledOnce);
      assert(consoleLogStub.calledWithMatch(/\x1b\[90m.*\[Gérico.*\]/, 'Test info message'));
    });
  });

  describe('warn', () => {
    it('should log message with warn color code', () => {
      logservice.warn('Test warn message');
      assert(consoleLogStub.calledOnce);
      assert(consoleLogStub.calledWithMatch(/\x1b\[93m.*\[Gérico.*\]/, 'Test warn message'));
    });
  });

  describe('error', () => {
    it('should log message with error color code', () => {
      logservice.error('Test error message');
      assert(consoleLogStub.calledOnce);
      assert(consoleLogStub.calledWithMatch(/\x1b\[91m.*\[Gérico.*\]/, 'Test error message'));
    });
  });

  describe('logMessage', () => {
    it('should log message with color code and args', () => {
      logservice.error('Test logMessage with args', 'arg1', 'arg2');
      assert(consoleLogStub.calledOnce);
      assert(
        consoleLogStub.calledWithMatch(
          /\x1b\[91m.*\[Gérico.*\]/,
          'Test logMessage with args',
          'arg1',
          'arg2',
        ),
      );
    });
  });
});
