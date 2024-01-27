import {describe, expect, test} from '@jest/globals';

import { interpretField, pad, parseContainers, parsingFunction } from '../src/utils';
import { FieldsType, SupportedTypes } from '../src/FieldsType';

describe('utils.js', () => {
  // 2024-01-10 seems not to be used anymore...
  // describe('utils.stringifyBufferObj', () => {
  //   const str = 'Hello World!'
  //   const str2 = 'Hello World!!!!!'
  //   const obj = {
  //     a: Buffer.from(str),
  //     b: 123,
  //     c: Buffer.from(str2)
  //   }
  //   const result = utils.stringifyBufferObj(obj)
  //   test('should return an object where all buffer values would be converted to string values', () => {
  //     result.a.should.be.equal(str)
  //     result.c.should.be.equal(str2)
  //     result.a.should.be.a('string')
  //     result.c.should.be.a('string')
  //   })
  //   test('should return an object', () => {
  //     result.should.be.a('object')
  //   })
  //   test('should not change values which aren\'t strings', () => {
  //     result.b.should.be.equal(123)
  //   })
  // })

  describe('utils.interpretField', () => {
    test('should return an object', () => {
      const data = Buffer.from('Test')
      const fields : FieldsType[] = []
      const result = interpretField(data, fields)
      expect(result).toBeInstanceOf(Object)
    })
    test('should return an empty object if fields is an empty arry', () => {
      const data = Buffer.from('Test')
      const fields : FieldsType[] = []
      const result = interpretField(data, fields)
      expect(Object.keys(result)).toHaveLength(0) // eslint-disable-line no-unused-expressions
    })
    test('should parse a buffer using a given data field specification', () => {
      const data = Buffer.from([0x14, 0x14, 0x06, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x21])
      const fields: FieldsType[] = [
        {
          name: "TAG",
          length: 2,
          interpreterFn: (x) => x.toString('hex')
        },
        {
          name: "LENGTH",
          length: 1,
        },
        {
          name: "TEXT",
          length: undefined,
          interpreterFn: (x) => x.toString()
        }
      ]
      const result = interpretField(data, fields)
      expect(result.TAG).toBe('1414')
      expect(result.LENGTH).toEqual(Buffer.from('06', 'hex'))
      expect(result.TEXT).toBe('Hello!')
    })
    test('should parse a buffer using a given data field specification', () => {
      const data = Buffer.from([0x14, 0x14, 0x06, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x21])
      const fields: FieldsType[] = [
        {
          name: 'TAG',
          length: 2,
          interpreterFn: (x: Buffer) => x.toString('hex')
        },
        {
          name: 'LENGTH',
          length: 1,
        },
        {
          name: 'TEXT',
          length: undefined,
          interpreterFn: (x: Buffer) => x.toString()
        }
      ]
      const result = interpretField(data, fields)
      expect(result.TAG).toBe('1414')
      expect(result.LENGTH).toEqual(Buffer.from('06', 'hex'))
      expect(result.TEXT).toBe('Hello!')
    })
  })

  describe('utils.parseContainers', () => {
    let results : SupportedTypes[]
    beforeEach((done) => {
      const data = Buffer.from('Test')
      const parsingFunction: parsingFunction = (buf: Buffer) => {
        
        const firstElement= buf.subarray(0, 1).toString()
        const secondElement = buf.subarray(1)
        return [firstElement, secondElement]
      }
      results = parseContainers(data, parsingFunction)
      done()
    })
    test('should return an array', () => {
      expect(Array.isArray(results)).toBe(true)
    })
    test('should parse the values with the given logic in the function', () => {
      expect(results).toEqual(['T', 'e', 's', 't'])
    })
  })

  describe('utils.pad', () => {
    test('should return a string', () => {
      expect(typeof pad(12, 4)).toBe('string')
    })
    test('should return a string with the give length', () => {
      const len = 12
      expect(pad(12, len).length).toBe(len)
    })
    test('should return a string respresentation of a number with leading zeros', () => {
      expect(pad(12, 4)).toBe('0012')
    })
    test('should return a string respresentation of a hexstring with leading zeros', () => {
      expect(pad('11', 4)).toBe('0011')
    })
  })


  // describe('utils.assignArrayToObj', () => {
  //   const TEST_DATA = [
  //     { hello: 'world' },
  //     { thats: 's' },
  //     { a: 'test' }
  //   ]
  //   const result = assignArrayToObj(TEST_DATA)

  //   test('should return an object', () => {
  //     expect(result).toBeInstanceOf(Object)
  //   })
  //   test('should have all given properties', () => {
  //     expect(result).toHaveProperty('hello', 'world')
  //     expect(result).toHaveProperty('thats', 's')
  //     expect(result).toHaveProperty('a', 'test')
  //   })
  // })
})
