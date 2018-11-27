var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
chai.should()

const verifyTicket = require('../lib/check_signature').verifyTicket

describe('check_signature.js', () => {
  describe('verifyTicket()', () => {
    it('should return null if no arguments are given', () => {
      return verifyTicket().should.become(null)
    })
    it('should return  null if no ticket header is available', () => {
      const ticket = {value: 'fooBar'}
      return verifyTicket(ticket).should.be.fulfilled.and.become(null)
    })
    it('should return Error if no ticket certificate is available', () => {
      var ticket = {}
      ticket.header = {
        umid: Buffer.from('235554', 'hex'),
        mt_version: Buffer.from('3031', 'hex'),
        rics: Buffer.from('1234'),
        key_id: Buffer.from('3030303036', 'hex')
      }
      return verifyTicket(ticket).should.be.rejectedWith(Error)
    })
    it('should return true if a valid signature is given', () => {
      var ticket = {}
      ticket.signature = Buffer.from('302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000', 'hex')
      ticket.ticketDataRaw = Buffer.from('789c65503b4ec34010b51b424395c60585810e643433fbf12e5d888d8c14a56095b4c80113b909911345825b701f3a2ec00138044760c68084c46aa57dfbdedb999d37bbadca510108601480830abd45cc74f46711330498a3665f5116a5182f27a080bc0585cc8aee7e4fca9dd7a80d456803486df0615d77ebae69374c1013480c94801103cfc062c67d7d901af288816640819d6818999bb6d9d47cb12cebe9db6bb75a34ddf26cdc6e9f02104abde9fc7492558b8714cd8576e9f5b844832a933347c52e6e89aa786c964d7ad5d5ab3bf91059e9d3cb4ee41fe1a4b705195066c073de321e33f48fe93f881c48ce17a9a7c869c9693efb0e37bae724e3783878f94cb683f764e78ea2d81d2712b090fb1f7b07c9ee7978f80598b65bdd', 'hex')
      ticket.header = {
        umid: Buffer.from('235554', 'hex'),
        mt_version: Buffer.from('3031', 'hex'),
        rics: Buffer.from('30303830', 'hex'),
        key_id: Buffer.from('3030303036', 'hex')
      }
      return verifyTicket(ticket).should.be.fulfilled.and.become(true)
    })
    it('should return false if an invalid message is given', () => {
      var ticket = {}
      ticket.signature = Buffer.from('302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000', 'hex')
      ticket.ticketDataRaw = Buffer.from('f000', 'hex')
      ticket.header = {
        umid: Buffer.from('235554', 'hex'),
        mt_version: Buffer.from('3031', 'hex'),
        rics: Buffer.from('30303830', 'hex'),
        key_id: Buffer.from('3030303036', 'hex')
      }
      return verifyTicket(ticket).should.be.fulfilled.and.become(false)
    })
  })
})
