var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const main = require('../index')

describe('index.js', () => {
  describe('index.readBarcode', () => {
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
})
