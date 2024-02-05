const { readFileSync } = require('node:fs')
const bcr = require('../lib/barcode-reader')
const chai = require('chai')

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

describe('barcode-reader.js', () => {
  describe('barcode-reader.ZXing', function () {
    this.timeout(4500)
    const dummy = readFileSync('test/images/barcode-dummy2.png')
    const ticket = Buffer.from('2355543031333431353030303033302e0215008beb83c5db49924a1387e99ed58fe2cc59aa8a8c021500f66f662724ca0b49a95d7f81810cbfa5696d06ed000030313730789c4d4ec10a824014fc95f70125f376db6cbd098a1db28434e8144b6c21a50777fdff56106d18dee1cd0c33cde398a719185052ee58710cc54ad13fa0a10438660eb62c276a1ef529bd87106bce2fd706218d09c133dd436906dff686cad1793b74a6efc1abbcafcddbbaba7d7eaca7ea3b3a884514ba1a6ceb9c1f5f96181bba15672aac339d1fccd8412e4e29451c4145d3320212602bf4fa90c9bc6a2e0d8c02596bfc005e033b47', 'hex')
    it('should return an object on sucess', () => {
      return bcr.ZXing(dummy).should.eventually.be.instanceOf(Buffer)
    })
    it('should be fulfilled', () => {
      return bcr.ZXing(dummy).should.be.fulfilled
    })
    it('should return the ticket data', () => {
      return bcr.ZXing(dummy)
        .should.eventually.deep.equal(ticket)
    })
  })
})
