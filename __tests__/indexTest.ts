import { describe, expect, test } from '@jest/globals';

import fs from 'fs';
import { readBarcode } from '../src/index';

describe('index.js', () => {
  describe('index.readBarcode', () => {
    describe('...when inputis a local file', () => {
      const dummy = '__tests__/images/barcode-dummy2.png';
      // const dummy3 = '__tests__/images/barcode-dummy3.png'
      const dummy4 = '__tests__/images/CT-003.png';
      const falseDummy = '__tests__/images/barcode dummy.png';
      test('should return an object on sucess', () => {
        return expect(readBarcode(dummy)).toBeInstanceOf(Object);
      });
      test('should eventually be resolved', () => {
        return expect(readBarcode(dummy)).resolves.toBeTruthy();
      });
      test('should reject if file not found', () => {
        return expect(readBarcode(falseDummy)).rejects.toThrow();
      });
      test('should handle verifySignature option and resolve', async () => {
        // eventually.have.deep.property('thing.foo', 'bar')
        // return Promise.resolve({ foo: 'bar' }).should.eventually.have.property('foo')
        // return (Promise.resolve({isSignatureValid: true})).should.eventually.have.deep.property('isSignatureValid', true)
        return expect(readBarcode(dummy4, { verifySignature: true })).resolves.toHaveProperty('isSignatureValid');
      });
    });
    describe('...when input is an image buffer', () => {
      const dummyBuff = fs.readFileSync('__tests__/images/barcode-dummy2.png');
      // const dummy3Buff = fs.readFileSync('__tests__/images/barcode-dummy3.png')
      const dummy4Buff = fs.readFileSync('__tests__/images/CT-003.png');
      test('should return an object on sucess', () => {
        return expect(readBarcode(dummyBuff)).resolves.toBeInstanceOf(Object);
      });

      test('should handle verifySignature option and resolve', async () => {
        // eventually.have.deep.property('thing.foo', 'bar')
        // return Promise.resolve({ foo: 'bar' }).should.eventually.have.property('foo')
        // return (Promise.resolve({isSignatureValid: true})).should.eventually.have.deep.property('isSignatureValid', true)
        return expect(readBarcode(dummy4Buff, { verifySignature: true })).resolves.toHaveProperty('isSignatureValid');
      });
    });
    // describe('...when input is something else', () => {
    //   test('should reject if input is array', () => {
    //     return readBarcode([1, 2, 3]).should.be.rejected
    //   })
    //   test('should reject if input is object', () => {
    //     return readBarcode({ nr: 3 }).should.be.rejected
    //   })
    //   test('should reject if input is null', () => {
    //     return readBarcode().should.be.rejected
    //   })
    // })
  });
  // describe('index.readPDFBarcode', () => {
  //   describe('...when input is something else', () => {
  //     test('should reject if input is array', () => {
  //       return main.readPDFBarcode([1, 2, 3]).should.be.rejected
  //     })
  //     test('should reject if input is object', () => {
  //       return main.readPDFBarcode({'nr': 3}).should.be.rejected
  //     })
  //     test('should reject if input is null', () => {
  //       return main.readPDFBarcode().should.be.rejected
  //     })
  //   })
  //   describe('...when input is a buffer', () => {
  //     const ticketPath = './__tests__/pdf/ticketdump.data'
  //     const ticket = fs.readFileSync(ticketPath)

  //     test('should be fulfilled with buffer input', () => {
  //       return main.readPDFBarcode(ticket).should.be.fulfilled
  //     })
  //     test('should be fulfilled with string input', () => {
  //       return main.readPDFBarcode(ticketPath).should.be.fulfilled
  //     })
  //   })
  // })
});
