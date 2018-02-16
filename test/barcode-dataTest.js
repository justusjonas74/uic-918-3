var chai = require('chai')
// var should = chai.should()
var dirtyChai = require('dirty-chai')
chai.use(dirtyChai)
chai.should()

var helper = require('./helper')

const bcd = require('../lib/barcode-data')

describe('barcode-data', () => {
  describe('barcode-data.interpret', () => {
    it('should return an object', () => {
      const ticket = helper.dummyTicket('U_HEAD', '01', 'Hi!')
      bcd.interpret(ticket).should.be.an('object')
    })
    it('should return an empty array if input param is an empty buffer.', () => {
      bcd.interpret(Buffer.from('')).ticketContainers.should.be.an('array').and.be.empty()
    })

    describe('on unknown data fields', () => {
      var results
      beforeEach((done) => {
        const ticket = helper.dummyTicket('MYID!!', '01', 'Test')
        results = bcd.interpret(ticket).ticketContainers
        done()
      })
      it('should ignore unkown data fields', () => {
        results.should.not.be.empty()
      })
      it('should parse the unknown container id', () => {
        results[0].id.should.be.equal('MYID!!')
      })
      it('should not touch/parse the container data', () => {
        results[0].container_data.should.be.deep.equal(Buffer.from('Test'))
      })
    })
    describe('on unknown data fieds versions but known id', () => {
      var results
      beforeEach((done) => {
        const ticket = helper.dummyTicket('U_HEAD', '03', 'Test')
        results = bcd.interpret(ticket).ticketContainers
        done()
      })
      it('should ignore unkown versions of data fields', () => {
        results.should.not.be.empty()
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
