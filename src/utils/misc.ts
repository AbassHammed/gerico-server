import { PaginationParams } from '../models/interface';

export function isString(str: unknown): str is string {
  return typeof str === 'string';
}

// we can't use this function, doesn't looks url friendly on the front
export function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateId(): string {
  // Using only lowercase letters (26 possibilities per character)
  // We'll use 24 characters to get log2(26^24) ≈ 112 bits of entropy
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const length = 24;
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => chars[x % chars.length])
    .join('');
}

/**
 * Replaces placeholders in the message with specified arguments.
 * Placeholders should be in the format `{index}`, where `index` corresponds to the argument position.
 * If no arguments are provided, the message is returned as is.
 *
 * Example Usage:
 * ```typescript
 * _format("Hello, {0}!", "world") => "Hello, world!"
 * _format("Item {0} has {1} units", "apple", 5) => "Item apple has 5 units"
 * _format("Boolean test: {0}", true) => "Boolean test: true"
 * _format("No args provided") => "No args provided"
 * ```
 */
export function _format(
  message: string,
  ...args: (string | number | boolean | undefined | null)[]
): string {
  return message.replace(/\{(\d+)\}/g, (match, rest) => {
    const index = parseInt(rest, 10);
    const arg = args[index];
    if (typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean') {
      return String(arg);
    }
    return match; // Keep the placeholder if the argument is missing
  });
}

/**
 * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
 * @param obj
 * @returns whether the provided param is a JavaScript Number or not.
 */
export function isNumber(obj: unknown): obj is number {
  return typeof obj === 'number' && !isNaN(obj);
}

export function shuffle<T>(array: T[], _seed?: number): void {
  let rand: () => number;

  if (typeof _seed === 'number') {
    let seed = _seed;
    // seeded random number generator in JS. Modified from:
    //https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    rand = () => {
      const x = Math.sin(seed++) * 179426549; // throw away most significant digits and reduce any potential bias
      return x - Math.floor(x);
    };
  } else {
    rand = Math.random;
  }

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export function getPaginationParams(query: PaginationParams): { limit: number; offset: number } {
  const page = Math.max(1, isNumber(Number(query.page)) ? query.page : DEFAULT_PAGE);
  const limit = Math.max(
    1,
    Math.min(isNumber(Number(query.limit)) ? query.limit : DEFAULT_LIMIT, 100),
  );
  const offset = isNumber(Number(query.offset)) ? query.offset : (page - 1) * limit;

  return { limit, offset };
}
