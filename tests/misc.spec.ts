import assert from 'assert';
import { isString, _format, isNumber, shuffle, generateId } from '../src/utils/misc';

describe('isString', () => {
  it('should return true for a valid string', () => {
    assert.strictEqual(isString('hello'), true);
  });

  it('should return false for a number', () => {
    assert.strictEqual(isString(123), false);
  });

  it('should return false for an object', () => {
    assert.strictEqual(isString({}), false);
  });

  it('should return false for null', () => {
    assert.strictEqual(isString(null), false);
  });

  it('should return false for undefined', () => {
    assert.strictEqual(isString(undefined), false);
  });
});

describe('generateId', () => {
  it('should generate a 24-character lowercase string', () => {
    const id = generateId();
    assert.match(id, /^[a-z]{24}$/);
  });

  it('should generate unique IDs each time', () => {
    const id1 = generateId();
    const id2 = generateId();
    assert.notStrictEqual(id1, id2);
  });

  it('should only contain lowercase letters', () => {
    const id = generateId();
    assert.strictEqual(id, id.toLowerCase());
  });

  it('should always be 24 characters long', () => {
    const id = generateId();
    assert.strictEqual(id.length, 24);
  });

  // This test verifies the distribution of characters
  it('should use the full alphabet', () => {
    // Generate multiple IDs to check character distribution
    const ids = Array.from({ length: 100 }, () => generateId());
    const allChars = ids.join('');

    // Check that all letters a-z are used
    const uniqueChars = new Set(allChars);
    assert.strictEqual(uniqueChars.size, 26);
  });
});

describe('_format', () => {
  it('should replace placeholders with string arguments', () => {
    const result = _format('Hello, {0}!', 'world');
    assert.strictEqual(result, 'Hello, world!');
  });

  it('should replace placeholders with number arguments', () => {
    const result = _format('The answer is {0}', 42);
    assert.strictEqual(result, 'The answer is 42');
  });

  it('should replace placeholders with boolean arguments', () => {
    const result = _format('Boolean test: {0}', true);
    assert.strictEqual(result, 'Boolean test: true');
  });

  it('should replace multiple placeholders', () => {
    const result = _format('Item {0} has {1} units', 'apple', 5);
    assert.strictEqual(result, 'Item apple has 5 units');
  });

  it('should return message unchanged if no arguments are provided', () => {
    const result = _format('No args provided');
    assert.strictEqual(result, 'No args provided');
  });

  it('should return message with placeholders intact if index is out of bounds', () => {
    const result = _format('Hello, {1}!', 'world');
    assert.strictEqual(result, 'Hello, {1}!');
  });
});

describe('isNumber', () => {
  it('should return true for a valid number', () => {
    assert.strictEqual(isNumber(123), true);
  });

  it('should return false for NaN', () => {
    assert.strictEqual(isNumber(NaN), false);
  });

  it('should return false for a string', () => {
    assert.strictEqual(isNumber('123'), false);
  });

  it('should return false for null', () => {
    assert.strictEqual(isNumber(null), false);
  });

  it('should return false for undefined', () => {
    assert.strictEqual(isNumber(undefined), false);
  });
});

// Tests for shuffle function
describe('shuffle', () => {
  it('should shuffle the array in place', () => {
    const array = [1, 2, 3, 4, 5];
    shuffle(array);
    assert.notDeepStrictEqual(array, [1, 2, 3, 4, 5]);
    assert.deepStrictEqual(
      array.sort((a, b) => a - b),
      [1, 2, 3, 4, 5],
    ); // Checks that all elements are still present
  });

  it('should produce a consistent shuffle with a seed', () => {
    const array1 = [1, 2, 3, 4, 5];
    const array2 = [1, 2, 3, 4, 5];
    shuffle(array1, 1);
    shuffle(array2, 1);
    assert.deepStrictEqual(array1, array2);
  });

  it('should produce a different shuffle with different seeds', () => {
    const array1 = [1, 2, 3, 4, 5];
    const array2 = [1, 2, 3, 4, 5];
    shuffle(array1, 1);
    shuffle(array2, 2);
    assert.notDeepStrictEqual(array1, array2);
  });

  it('should handle an empty array', () => {
    const array: number[] = [];
    shuffle(array);
    assert.deepStrictEqual(array, []);
  });
});
