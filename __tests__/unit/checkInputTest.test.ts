import { describe, expect, test, beforeAll } from 'vitest';

import path from 'path';
import fs from 'fs';

import { loadFileOrBuffer } from '../../src/checkInput';

describe('checkInput.js', () => {
  const filePath = {
    relative_true: '',
    relative_false: '' + '1458',
    absolute_true: '',
    absolute_false: ''
  };

  beforeAll(() => {
    const file = 'package.json';
    filePath.relative_true = file;
    filePath.relative_false = file + '1458';
    filePath.absolute_true = path.resolve(file);
    filePath.absolute_false = path.resolve(file) + '254';
  });

  describe('loadFileOrBuffer', () => {
    describe('with no optional parameters - relative filepath', () => {
      test('should be fulfilled with a string', () => {
        return expect(loadFileOrBuffer(filePath.relative_true)).resolves.toStrictEqual(
          fs.readFileSync(filePath.relative_true)
        );
      });
      test('should be fulfilled with a string - absolute filepath', () => {
        return expect(loadFileOrBuffer(filePath.absolute_true)).resolves.toStrictEqual(
          fs.readFileSync(filePath.absolute_true)
        );
      });
      test('should be fulfilled with a Buffer', () => {
        const buf = Buffer.from('01125684');

        return expect(loadFileOrBuffer(buf)).resolves.toBe(buf);
      });
      test('should be rejected with a wrong file path', () => {
        return expect(loadFileOrBuffer(filePath.relative_false)).rejects.toThrow();
      });
      test('should throw an error, if argument is not a Buffer or string', () => {
        // @ts-expect-error Testing correct Error Handling in a non typesafe JS runtime
        return expect(loadFileOrBuffer(123)).rejects.toThrow();
      });
    });
  });
});
