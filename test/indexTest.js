var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
const fs = require('fs')
chai.use(chaiAsPromised)
chai.should()

const main = require('../index')

describe('index.js', () => {
  describe('index.readBarcode', () => {
    describe('...when inputis a local file', () => {
      const dummy = 'test/images/barcode-dummy2.png'
      const dummy3 = 'test/images/barcode-dummy3.png'
      const falseDummy = 'test/images/barcode dummy.png'
      it('should return an object on sucess', () => {
        return main.readBarcode(dummy).should.eventually.be.an('object')
      })
      it('should eventually be resolved', () => {
        return main.readBarcode(dummy).should.eventually.be.fulfilled
      })
      it('should reject if file not found', () => {
        return main.readBarcode(falseDummy).should.be.rejected
      })
      it('should handle verifySignature option and resolve', async () => {
        // eventually.have.deep.property('thing.foo', 'bar')
        // return Promise.resolve({ foo: 'bar' }).should.eventually.have.property('foo')
        // return (Promise.resolve({isSignatureValid: true})).should.eventually.have.deep.property('isSignatureValid', true)
        return main.readBarcode(dummy3, {verifySignature: true}).should.eventually.have.property('isSignatureValid')
      })
    })
    describe('...when input is an image buffer', () => {
      const dummyBuff = fs.readFileSync('test/images/barcode-dummy2.png')
      const dummy3Buff = fs.readFileSync('test/images/barcode-dummy3.png')
      it('should return an object on sucess', () => {
        return main.readBarcode(dummyBuff).should.eventually.be.an('object')
      })
      it('should eventually be resolved', () => {
        return main.readBarcode(dummyBuff).should.eventually.be.fulfilled
      })
      it('should handle verifySignature option and resolve', async () => {
        // eventually.have.deep.property('thing.foo', 'bar')
        // return Promise.resolve({ foo: 'bar' }).should.eventually.have.property('foo')
        // return (Promise.resolve({isSignatureValid: true})).should.eventually.have.deep.property('isSignatureValid', true)
        return main.readBarcode(dummy3Buff, {verifySignature: true}).should.eventually.have.property('isSignatureValid')
      })
    })
    describe('...when input is something else', () => {
      it('should reject if input is array', () => {
        return main.readBarcode([1, 2, 3]).should.be.rejected
      })
      it('should reject if input is object', () => {
        return main.readBarcode({'nr': 3}).should.be.rejected
      })
      it('should reject if input is null', () => {
        return main.readBarcode().should.be.rejected
      })
    })
  })
  // describe('index.readPDFBarcode', () => {
  //   describe('...when input is something else', () => {
  //     it('should reject if input is array', () => {
  //       return main.readPDFBarcode([1, 2, 3]).should.be.rejected
  //     })
  //     it('should reject if input is object', () => {
  //       return main.readPDFBarcode({'nr': 3}).should.be.rejected
  //     })
  //     it('should reject if input is null', () => {
  //       return main.readPDFBarcode().should.be.rejected
  //     })
  //   })
  //   describe('...when input is a buffer', () => {
  //     const ticketPath = './test/pdf/ticketdump.data'
  //     const ticket = fs.readFileSync(ticketPath)

  //     it('should be fulfilled with buffer input', () => {
  //       return main.readPDFBarcode(ticket).should.be.fulfilled
  //     })
  //     it('should be fulfilled with string input', () => {
  //       return main.readPDFBarcode(ticketPath).should.be.fulfilled
  //     })
  //   })
  // })
})
