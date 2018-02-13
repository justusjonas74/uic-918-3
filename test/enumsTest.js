var should = require('chai').should();

const enums = require('../lib/enums');
var Enum = require('enum');

describe('enums.sBlockTypes', ()=>{
    var sBlockTypes;
     beforeEach((done)=>{
        sBlockTypes = enums.sBlockTypes;
        done();
    }); 
    it('should return an instance of enum', ()=>{
        sBlockTypes.should.be.an.instanceof(Enum);
    });  
    it('should not be empty', () => {
        sBlockTypes.enums.should.not.be.empty;
    });
});