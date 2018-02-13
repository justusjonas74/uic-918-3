var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const main = require('../index');
var helper = require('./helper');

describe('index.js', () => {
    describe('index.readBarcode', () =>{
        //const dummy = 'test/images/barcode-dummy.png';
        const dummy = 'test/images/barcode-dummy2.png';
        const false_dummy = 'test/images/barcode dummy.png';
        it('should return an object on sucess', ()=>{
            main.readBarcode(dummy).should.eventually.be.an('object');
        });
        it('should eventually be resolved', ()=>{
            main.readBarcode(dummy).should.eventually.be.fulfilled;
        });
        it('should reject if file not found', () =>{
            main.readBarcode(false_dummy).should.be.rejected;
        });
    });
});
