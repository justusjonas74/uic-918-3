var should = require('chai').should();

const enums = require('../lib/enums');
var Enum = require('enum');

describe('enums.sBlockTypes', ()=>{
    var sBlockTypes= enums.sBlockTypes;
    it('should return an instance of enum', ()=>{
        sBlockTypes.should.be.an.instanceof(Enum);
    });  
    it('should not be empty', () => {
        sBlockTypes.enums.should.not.be.empty;
    });
});
describe('enums.id_types', ()=>{
    var result= enums.id_types;
    it('should return an instance of enum', ()=>{
        result.should.be.an.instanceof(Enum);
    });  
    it('should not be empty', () => {
        result.enums.should.not.be.empty;
    });
});