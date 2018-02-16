var chai = require('chai')
var dirtyChai = require('dirty-chai')
chai.use(dirtyChai)

var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()
const main = require('../index')

describe('index.js', () => {
  describe('index.readBarcode', () => {
        // const dummy = 'test/images/barcode-dummy.png';
    const dummy = 'test/images/barcode-dummy2.png'
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
  })
})
