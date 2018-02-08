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
        const dummy = 'test/images/barcode-dummy.png';
        //const ticket = helper.dummyTicket('U_TEST', '03','Test');
        const ticket = Buffer.from('2355543031303038303030303036302c021402c3afc2bfc2bd68c3afc2bfc2bdc3afc2bfc2bdc3afc2bfc2bdc3afc2bfc2bdc3afc2bfc2bd2bc3afc2bfc2bdc3afc2bfc2bd21c3afc2bfc2bd03c3afc2bfc2bd2512c3afc2bfc2bd6504021441c3afc2bfc2bdc3afc2bfc2bdc3afc2bfc2bd7ec3afc2bfc2bd0c02c3afc2bfc2bd1bc3afc2bfc2bd06c3afc2bfc2bd362ac3afc2bfc2bdc3afc2bfc2bd34c3afc2bfc2bd5b000000003030323478c3afc2bfc2bd0bc3afc2bfc2bd0f710d0e3130363030340b492d2e0100271204c3afc2bfc2bd', 'hex');
            // before(()=>{
                //ticket = helper.dummyTicket('U_TEST', '03','Test');
                //return helper.dummyBarcode(ticket.toString()).then((bc)=> result=bc)
                // .then((t) => {ticket_fixed = helper.unfixingZXing(t);})
                // .catch((e)=>console.log(e.message));
            // });

        it('should return an object on sucess', ()=>{
            return  bcr.ZXing(dummy).should.eventually.be.an('object');
        });
         it('should be fulfilled', ()=>{
            return bcr.ZXing(dummy).should.be.fulfilled;
        });
        it('should have property of raw', ()=>{
            return bcr.ZXing(dummy)
            .should.eventually.have.deep.property('raw');
        });
        it('should return the ticket data', ()=>{
            return bcr.ZXing(dummy)
            .should.eventually.have.deep.property('raw', ticket);
        });
    });
});
