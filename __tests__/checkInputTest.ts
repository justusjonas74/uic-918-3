import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
expect(chai)()

import path  from 'path'
import fs from 'fs'

import { fileExists, fileWillExists, loadFileOrBuffer, readFileAsync } from '../src/checkInput'

describe('checkInput.js', () => {
  const filePath = {
    relative_true : "",
    relative_false : "" + '1458',
    absolute_true : "",
    absolute_false : ""
  }

  beforeEach((done) => {
    const file = 'index.js'
    filePath.relative_true = file
    filePath.relative_false = file + '1458'
    filePath.absolute_true = path.resolve(file)
    filePath.absolute_false = path.resolve(file) + '254'
    done()
  })

  describe('fileExists', () => {
    it('should return false if a file with relative path isn\'t found', () => {
      expect(fileExists(filePath.relative_false)).toBe(false) // eslint-disable-line no-unused-expressions
    })
    it('should return true if a file with relative path is found', () => {
      expect(fileExists(filePath.relative_true)).toBe(true) // eslint-disable-line no-unused-expressions
    })
    it('should return false if a file with absolute path isn\'t found', () => {
      expect(fileExists(filePath.absolute_false)).toBe(false) // eslint-disable-line no-unused-expressions
    })
    it('should return true if a file with absolute path is found', () => {
      expect(fileExists(filePath.absolute_true)).toBe(true) // eslint-disable-line no-unused-expressions
    })
  })

  describe('fileWillExists', () => {
    it('should return false if a file with relative path isn\'t found', () => {
      return expect(fileWillExists(filePath.relative_false)).be.rejected; // eslint-disable-line no-unused-expressions
    })
    it('should return true if a file with relative path is found', () => {
      return expect(fileWillExists(filePath.relative_true)).toBe(filePath.relative_true); // eslint-disable-line no-unused-expressions
    })
    it('should return false if a file with absolute path isn\'t found', () => {
      return expect(fileWillExists(filePath.absolute_false)).be.rejected; // eslint-disable-line no-unused-expressions
    })
    it('should return true if a file with absolute path is found', () => {
      return expect(fileWillExists(filePath.absolute_true)).toBe(filePath.absolute_true);// eslint-disable-line no-unused-expressions
    })
  })
  describe('readFileAsync', () => {

    it('should return false if a file with relative path isn\'t found', () => {
      return expect(readFileAsync(filePath.relative_false)).be.rejected; // eslint-disable-line no-unused-expressions
    })
    it('should return true if a file with relative path is found', () => {
      return expect(readFileAsync(filePath.relative_true)).become(fs.readFileSync(filePath.relative_true)); // eslint-disable-line no-unused-expressions
    })
    it('should return false if a file with absolute path isn\'t found', () => {
      return expect(readFileAsync(filePath.absolute_false)).be.rejected; // eslint-disable-line no-unused-expressions
    })
    it('should return true if a file with absolute path is found', () => {
      return expect(readFileAsync(filePath.absolute_true)).become(fs.readFileSync(filePath.absolute_true));// eslint-disable-line no-unused-expressions
    })
  })

  describe('isBufferOrString', () => {
    describe('with no optional parameters', () => {
      it('should be fulfilled with a string', () => {
        expect(loadFileOrBuffer(filePath.relative_true)).be.fulfilled // eslint-disable-line no-unused-expressions
        return expect(loadFileOrBuffer(filePath.relative_true)).become(fs.readFileSync(filePath.relative_true)); // eslint-disable-line no-unused-expressions
      })
      it('should be fulfilled with a Buffer', () => {
        const buf = Buffer.from('01125684')
        expect(loadFileOrBuffer(buf)).be.fulfilled // eslint-disable-line no-unused-expressions
        return expect(loadFileOrBuffer(buf)).become(buf); // eslint-disable-line no-unused-expressions
      })
      it('should be rejected with a wrong file path', () => {
        return expect(loadFileOrBuffer(filePath.relative_false)).be.rejected; // eslint-disable-line no-unused-expressions
      })
    })
  })
})
