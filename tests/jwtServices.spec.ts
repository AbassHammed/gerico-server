import assert from 'assert';
import { JwtServices } from '../src/services/jwtServices';

describe('JwtServices', () => {
  const secret = 'mysecretkey';
  const jwt = new JwtServices(secret);
  const payload = { uid: '12345' };

  let token: string;

  describe('encode', () => {
    it('should generate a valid JWT token', () => {
      token = jwt.encode(payload);
      assert.ok(token);
      const parts = token.split('.');
      assert.strictEqual(
        parts.length,
        3,
        'Token should have three parts (header, payload, signature)',
      );
    });
  });

  describe('decode', () => {
    it('should decode a valid token and return the original payload', () => {
      const decodedPayload = jwt.decode(token);
      assert.deepStrictEqual(decodedPayload, payload);
    });

    it('should throw an error if the token format is invalid', () => {
      assert.throws(() => jwt.decode('invalidtoken'), /Invalid token format/);
    });

    it('should throw an error if the token has an invalid signature', () => {
      const tamperedToken = token.replace(/.$/, 'x');
      assert.throws(() => jwt.decode(tamperedToken), /Invalid token signature/);
    });
  });

  describe('base64URLEncode and base64URLDecode', () => {
    it('should encode and decode to the same string', () => {
      const originalString = 'teststring';
      const encoded = jwt['base64URLEncode'](originalString);
      const decoded = jwt['base64URLDecode'](encoded);
      assert.strictEqual(decoded, originalString);
    });

    it('should encode strings without padding', () => {
      const encoded = jwt['base64URLEncode']('test');
      assert.ok(!encoded.includes('='));
    });
  });

  describe('edge cases', () => {
    it('should throw an error if token is missing parts', () => {
      const incompleteToken = token.split('.').slice(0, 2).join('.');
      assert.throws(() => jwt.decode(incompleteToken), /Invalid token format/);
    });

    it('should throw an error if secret key changes', () => {
      const differentSecretJwt = new JwtServices('differentSecret');
      assert.throws(() => differentSecretJwt.decode(token), /Invalid token signature/);
    });
  });
});
