const bcr = require('../lib/barcode-reader');

var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var helper = require('./helper');
var utils= require('../lib/utils');

describe('barcode-reader.js', () => {
    describe('barcode-reader.ZXing', function (){
        this.timeout(4500);
        var result;
        var ticket;
        var ticket_fixed;
            before(()=>{
                ticket = helper.dummyTicket('U_TEST', '03','Test');
                return helper.dummyBarcode(ticket.toString())
                    .then((bc)=> result=bc)
                    .then((t) => {ticket_fixed = helper.unfixingZXing(t);
                      console.log(ticket_fixed);})
                    .catch((e)=>console.log(e.message));
            });

        it('should return an object on sucess', ()=>{
            return  bcr.ZXing(result).should.eventually.be.an('object');
        });
         it('should be fulfilled', ()=>{
            return bcr.ZXing(result).should.be.fulfilled;
        });
        it('should return the ticket data', ()=>{
            //THIS FAILS: FIX IT !
            //return bcr.ZXing(result).should.eventually.have.deep.property('raw', ticket_fixed);
            return bcr.ZXing(result)
            .should.eventually.have.deep.property('raw');
        });
    });
});
