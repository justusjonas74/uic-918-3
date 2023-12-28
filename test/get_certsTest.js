const fs = require('fs')
const path = require('path')
const chai = require('chai')

chai.should()

const gc = require('../lib/get_certs')
const fileName = require('../lib/cert_url.json').fileName
const filePath = path.join(__dirname, '../', fileName)

describe('get_certs.js', () => {
  describe('updateLocalCerts', () => {
    before((done) => {
      // remove keys.json
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      gc.updateLocalCerts(filePath)
      done()
    })
    it('should create a not empty file', () => {
      // expect(file(filePath)).to.exist.and.to.not.be.empty()
    })
  })
  describe('getCertByID', () => {
    it('should return ', () => {
    // gc.getCertByID().should
    })
  })
})
