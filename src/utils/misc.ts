/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Hammed Abass. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { PaginationParams } from '../models/interface';

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
 * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
 * @param obj
 * @returns whether the provided param is a JavaScript Number or not.
 */
function isNumber(obj: unknown): obj is number {
  return typeof obj === 'number' && !isNaN(obj);
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function getPaginationParams(query: PaginationParams): { limit: number; offset: number } {
  const page = Math.max(1, isNumber(Number(query.page)) ? query.page : DEFAULT_PAGE);
  const limit = Math.max(
    1,
    Math.min(isNumber(Number(query.limit)) ? query.limit : DEFAULT_LIMIT, 100),
  );
  const offset = isNumber(Number(query.offset)) ? query.offset : (page - 1) * limit;

  return { limit, offset };
}

export function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
