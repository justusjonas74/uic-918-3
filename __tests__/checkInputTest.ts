import { describe, expect, test, beforeAll } from '@jest/globals';

import path from 'path';
import fs from 'fs';

import {
  fileExists,
  fileWillExists,
  loadFileOrBuffer,
  readFileAsync
} from '../src/checkInput';

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
    // done()
  });

  describe('fileExists', () => {
    test("should return false if a file with relative path isn't found", () => {
      expect(fileExists(filePath.relative_false)).toBe(false);
    });
    test('should return true if a file with relative path is found', () => {
      expect(fileExists(filePath.relative_true)).toBe(true);
    });
    test("should return false if a file with absolute path isn't found", () => {
      expect(fileExists(filePath.absolute_false)).toBe(false);
    });
    test('should return true if a file with absolute path is found', () => {
      expect(fileExists(filePath.absolute_true)).toBe(true);
    });
  });

  describe('fileWillExists', () => {
    test('should return true if a file with relative path is found', () => {
      return expect(fileWillExists(filePath.relative_true)).resolves.toBe(
        filePath.relative_true
      );
    });

    test('should return true if a file with absolute path is found', () => {
      return expect(fileWillExists(filePath.absolute_true)).resolves.toBe(
        filePath.absolute_true
      );
    });
  });
  describe('readFileAsync', () => {
    test('should return true if a file with relative path is found', () => {
      return expect(
        readFileAsync(filePath.relative_true)
      ).resolves.toStrictEqual(fs.readFileSync(filePath.relative_true));
    });
    test("should return false if a file with absolute path isn't found", () => {
      return expect(readFileAsync(filePath.absolute_false)).rejects.toThrow();
    });
    test('should return true if a file with absolute path is found', () => {
      return expect(
        readFileAsync(filePath.absolute_true)
      ).resolves.toStrictEqual(fs.readFileSync(filePath.absolute_true));
    });
  });

  describe('isBufferOrString', () => {
    describe('with no optional parameters', () => {
      test('should be fulfilled with a string', () => {
        return expect(
          loadFileOrBuffer(filePath.relative_true)
        ).resolves.toStrictEqual(fs.readFileSync(filePath.relative_true)); // eslint-disable-line no-unused-expressions
      });
      test('should be fulfilled with a Buffer', () => {
        const buf = Buffer.from('01125684');

        return expect(loadFileOrBuffer(buf)).resolves.toBe(buf); // eslint-disable-line no-unused-expressions
      });
      test('should be rejected with a wrong file path', () => {
        return expect(
          loadFileOrBuffer(filePath.relative_false)
        ).rejects.toThrow();
      });
    });
  });
});
