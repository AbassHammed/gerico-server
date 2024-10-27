import * as crypto from 'node:crypto';

export class Jwt {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  private base64URLEncode(text: string): string {
    return Buffer.from(text)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private base64URLDecode(text: string): string {
    const base64 = text.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf-8');
  }

  public encode(payload: Record<string, unknown>): string {
    const header = this.base64URLEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = this.base64URLEncode(JSON.stringify(payload));
    const signature = this.base64URLEncode(
      crypto
        .createHmac('sha256', this.secret)
        .update(`${header}.${payloadEncoded}`)
        .digest('binary'),
    );

    return `${header}.${payloadEncoded}.${signature}`;
  }

  public decode(token: string): Record<string, unknown> {
    const parts = token.match(/^(?<header>.+)\.(?<payload>.+)\.(?<signature>.+)$/);
    if (!parts || !parts.groups) {
      throw new Error('Invalid token format');
    }

    const { header, payload, signature } = parts.groups;
    const validSignature = crypto
      .createHmac('sha256', this.secret)
      .update(`${header}.${payload}`)
      .digest('binary');
    const decodedSignature = this.base64URLDecode(signature);

    if (
      !crypto.timingSafeEqual(
        Buffer.from(validSignature, 'binary'),
        Buffer.from(decodedSignature, 'binary'),
      )
    ) {
      throw new Error('Invalid token signature');
    }

    return JSON.parse(this.base64URLDecode(payload));
  }
}
