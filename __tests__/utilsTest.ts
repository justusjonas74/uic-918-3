import { describe, expect, beforeEach, test, jest } from '@jest/globals';

import { handleError, interpretField, pad, parseContainers, parsingFunction } from '../src/utils';
import { FieldsType, SupportedTypes } from '../src/FieldsType';

describe('utils.js', () => {
  describe('utils.interpretField', () => {
    test('should return an object', () => {
      const data = Buffer.from('Test');
      const fields: FieldsType[] = [];
      const result = interpretField(data, fields);
      expect(result).toBeInstanceOf(Object);
    });
    test('should return an empty object if fields is an empty arry', () => {
      const data = Buffer.from('Test');
      const fields: FieldsType[] = [];
      const result = interpretField(data, fields);
      expect(Object.keys(result)).toHaveLength(0);
    });
    test('should parse a buffer using a given data field specification', () => {
      const data = Buffer.from([0x14, 0x14, 0x06, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x21]);
      const fields: FieldsType[] = [
        {
          name: 'TAG',
          length: 2,
          interpreterFn: (x) => x.toString('hex')
        },
        {
          name: 'LENGTH',
          length: 1
        },
        {
          name: 'TEXT',
          length: undefined,
          interpreterFn: (x) => x.toString()
        }
      ];
      const result = interpretField(data, fields);
      expect(result.TAG).toBe('1414');
      expect(result.LENGTH).toEqual(Buffer.from('06', 'hex'));
      expect(result.TEXT).toBe('Hello!');
    });
    test('should parse a buffer using a given data field specification', () => {
      const data = Buffer.from([0x14, 0x14, 0x06, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x21]);
      const fields: FieldsType[] = [
        {
          name: 'TAG',
          length: 2,
          interpreterFn: (x: Buffer) => x.toString('hex')
        },
        {
          name: 'LENGTH',
          length: 1
        },
        {
          name: 'TEXT',
          length: undefined,
          interpreterFn: (x: Buffer) => x.toString()
        }
      ];
      const result = interpretField(data, fields);
      expect(result.TAG).toBe('1414');
      expect(result.LENGTH).toEqual(Buffer.from('06', 'hex'));
      expect(result.TEXT).toBe('Hello!');
    });
  });

  describe('utils.parseContainers', () => {
    let results: SupportedTypes[];
    beforeEach((done) => {
      const data = Buffer.from('Test');
      const parsingFunction: parsingFunction = (buf: Buffer) => {
        const firstElement = buf.subarray(0, 1).toString();
        const secondElement = buf.subarray(1);
        return [firstElement, secondElement];
      };
      results = parseContainers(data, parsingFunction);
      done();
    });
    test('should return an array', () => {
      expect(Array.isArray(results)).toBe(true);
    });
    test('should parse the values with the given logic in the function', () => {
      expect(results).toEqual(['T', 'e', 's', 't']);
    });
  });

  describe('utils.pad', () => {
    test('should return a string', () => {
      expect(typeof pad(12, 4)).toBe('string');
    });
    test('should return a string with the give length', () => {
      const len = 12;
      expect(pad(12, len).length).toBe(len);
    });
    test('should return a string respresentation of a number with leading zeros', () => {
      expect(pad(12, 4)).toBe('0012');
    });
    test('should return a string respresentation of a hexstring with leading zeros', () => {
      expect(pad('11', 4)).toBe('0011');
    });
  });

  describe('utils.handleError', () => {
    test('Should write Error Message to console', () => {
      const throwErrorFunction = (): void => {
        throw new Error('Fatal Error');
      };
      const logSpy = jest.spyOn(global.console, 'log');

      try {
        throwErrorFunction();
      } catch (err) {
        const e = err as Error;
        handleError(e);
      }

      expect(logSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(new Error('Fatal Error'));
      expect(logSpy.mock.calls).toContainEqual([new Error('Fatal Error')]);

      logSpy.mockRestore();
    });
  });
});
