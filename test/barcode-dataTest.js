const chai = require('chai')
chai.should()

const helper = require('./helper')

const interpretBarcode = require('../lib/barcode-data')

describe('barcode-data', () => {
  describe('barcode-data.interpret', () => {
    it('should return an object for ticket version 1', () => {
      const ticket = helper.dummyTicket('U_HEAD', '01', 'Hi!')
      interpretBarcode(ticket).should.be.an('object')
    })
    it('should return an object for ticket version 2', () => {
      const ticket = helper.dummyTicket('U_HEAD', '02', 'Hi!')
      interpretBarcode(ticket).should.be.an('object')
    })
    it('should show the correct version for ticket version 1', () => {
      const ticket = helper.dummyTicket('U_HEAD', '01', 'Hi!')
      interpretBarcode(ticket).version.should.be.equal(1)
    })
    it('should show the correct version for ticket version 2', () => {
      const ticket = helper.dummyTicket2('U_HEAD', '01', 'Hi!')
      interpretBarcode(ticket).version.should.be.equal(2)
    })
    it('should return an empty array if input param is an empty buffer.', () => {
      interpretBarcode(Buffer.from('')).ticketContainers.should.be.an('array')
      interpretBarcode(Buffer.from('')).ticketContainers.should.be.empty // eslint-disable-line no-unused-expressions
    })

    describe('on unknown data fields', () => {
      let results
      beforeEach((done) => {
        const ticket = helper.dummyTicket('MYID!!', '01', 'Test')
        results = interpretBarcode(ticket).ticketContainers
        done()
      })
      it('should ignore unkown data fields', () => {
        results.should.not.be.empty // eslint-disable-line no-unused-expressions
      })
      it('should parse the unknown container id', () => {
        results[0].id.should.be.equal('MYID!!')
      })
      it('should not touch/parse the container data', () => {
        results[0].container_data.should.be.deep.equal(Buffer.from('Test'))
      })
    })
    describe('on unknown data fieds versions but known id', () => {
      let results
      beforeEach((done) => {
        const ticket = helper.dummyTicket('U_HEAD', '03', 'Test')
        results = interpretBarcode(ticket).ticketContainers
        done()
      })
      it('should ignore unkown versions of data fields', () => {
        results.should.not.be.empty // eslint-disable-line no-unused-expressions
      })
      it('should parse the unknown container id', () => {
        results[0].id.should.be.equal('U_HEAD')
      })
      it('should not touch/parse the container data', () => {
        results[0].container_data.should.be.deep.equal(Buffer.from('Test'))
      })
    })
  })
})
