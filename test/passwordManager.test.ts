/* eslint-disable quotes */
import assert from 'assert';
import passwordManager from '../src/services/passwordManager';

describe('PasswordManager', () => {
  describe('generateDefaultPassword', () => {
    it('should generate a password of exactly 8 characters for typical input', () => {
      const password = passwordManager.generateDefaultPassword('Smith', new Date('2000-01-01'));
      assert.strictEqual(password, '2000SMITH');
    });

    it('should handle short last names by padding with zeros to reach 8 characters', () => {
      const password = passwordManager.generateDefaultPassword('Lee', new Date('2000-01-01'));
      assert.strictEqual(password, '2000LEE0');
    });

    it('should return a password that only has zeros padding if last name is empty', () => {
      const password = passwordManager.generateDefaultPassword('', new Date('2000-01-01'));
      assert.strictEqual(password, '20000000');
    });

    it('should trim whitespace from last name and generate a password', () => {
      const password = passwordManager.generateDefaultPassword(
        "  O'Neil   ",
        new Date('1990-06-15'),
      );
      assert.strictEqual(password, '1990ONEIL');
    });

    it('should convert last name to uppercase', () => {
      const password = passwordManager.generateDefaultPassword('doe', new Date('1985-05-05'));
      assert.strictEqual(password, '1985DOE0');
    });
  });

  describe('isDefaultPattern', () => {
    it('should return true for valid default pattern', () => {
      assert.strictEqual(passwordManager.isDefaultPattern('2000SMITH'), true);
    });

    it('should return true for valid default pattern with padding zeros', () => {
      assert.strictEqual(passwordManager.isDefaultPattern('1990LEE00'), true);
    });

    it('should return false if password has fewer than 8 characters', () => {
      assert.strictEqual(passwordManager.isDefaultPattern('200LEE'), false);
    });

    it('should return false for passwords that don’t match the 4-digit start pattern', () => {
      assert.strictEqual(passwordManager.isDefaultPattern('ABC2000LEE'), false);
    });

    it('should return false if non-alphabetic characters follow the year', () => {
      assert.strictEqual(passwordManager.isDefaultPattern('2000SMITH1'), false);
    });

    it('should return false for lowercase letters after the digits', () => {
      assert.strictEqual(passwordManager.isDefaultPattern('2000smith'), false);
    });

    it('should return false if password contains special characters', () => {
      assert.strictEqual(passwordManager.isDefaultPattern('2000S@ITH'), false);
    });
  });
});
