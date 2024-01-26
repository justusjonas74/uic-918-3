import * as chai from 'chai';
chai.should()

import { FieldsType, SupportedTypes, assignArrayToObj, interpretField, pad, parseContainers, parsingFunction } from '../src/utils';

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
  //   it('should return an object where all buffer values would be converted to string values', () => {
  //     result.a.should.be.equal(str)
  //     result.c.should.be.equal(str2)
  //     result.a.should.be.a('string')
  //     result.c.should.be.a('string')
  //   })
  //   it('should return an object', () => {
  //     result.should.be.a('object')
  //   })
  //   it('should not change values which aren\'t strings', () => {
  //     result.b.should.be.equal(123)
  //   })
  // })

  describe('utils.interpretField', () => {
    it('should return an object', () => {
      const data = Buffer.from('Test')
      const fields : FieldsType[] = []
      const result = interpretField(data, fields)
      result.should.be.an('object')
    })
    it('should return an empty object if fields is an empty arry', () => {
      const data = Buffer.from('Test')
      const fields : FieldsType[] = []
      const result = interpretField(data, fields)
      result.should.be.empty // eslint-disable-line no-unused-expressions
    })
    it('should parse a buffer using a given data field specification', () => {
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
      result.TAG.should.be.equal('1414')
      result.LENGTH.should.be.deep.equal(Buffer.from('06', 'hex'))
      result.TEXT.should.be.equal('Hello!')
    })
    it('should parse a buffer using a given data field specification', () => {
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
      result.TAG.should.be.equal('1414')
      result.LENGTH.should.be.deep.equal(Buffer.from('06', 'hex'))
      result.TEXT.should.be.equal('Hello!')
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
    it('should return an array', () => {
      results.should.be.a('array')
    })
    it('should parse the values with the given logic in the function', () => {
      results.should.be.deep.equal(['T', 'e', 's', 't'])
    })
  })

  describe('utils.pad', () => {
    it('should return a string', () => {
      pad(12, 4).should.be.a('string')
    })
    it('should return a string with the give length', () => {
      const len = 12
      pad(12, len).length.should.be.equal(len)
    })
    it('should return a string respresentation of a number with leading zeros', () => {
      pad(12, 4).should.be.equal('0012')
    })
    it('should return a string respresentation of a hexstring with leading zeros', () => {
      pad('11', 4).should.be.equal('0011')
    })
  })


  describe('utils.assignArrayToObj', () => {
    const TEST_DATA = [
      { hello: 'world' },
      { thats: 's' },
      { a: 'test' }
    ]
    const result = assignArrayToObj(TEST_DATA)

    it('should return an object', () => {
      result.should.be.an('object')
    })
    it('should have all given properties', () => {
      result.should.have.deep.property('hello', 'world')
      result.should.have.deep.property('thats', 's')
      result.should.have.deep.property('a', 'test')
    })
  })
})
