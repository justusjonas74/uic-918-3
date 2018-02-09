var chai = require("chai");
var should = chai.should();
chai.use(require('chai-things'));

const bt = require('../lib/block-types');

describe('block-types.js', ()=>{
    it('should return an array', ()=>{
        bt.should.be.an('array');
    }), 
    it('should only return objects inside the array with a property of name', ()=>{
        bt.should.all.have.property('name');
    }),
    it('should only return objects inside the array with a property of versions', ()=>{
        bt.should.all.have.property('versions');
    });
    describe('Generic Types', ()=>{
        describe('STRING', ()=>{
            it('should return an String from a Buffer',()=>{
                const data_type_arr = bt[0].versions['01'][0];
                const res = data_type_arr[2];
                const test_value = 'GAUF';
                res(Buffer.from(test_value)).should.be.equal(test_value);
            });
        });
        describe('HEX', ()=>{
            it('should return a hexadecimal encoded string representation from a Buffer',()=>{
                const data_type_arr = bt[0].versions['01'][2];
                const res = data_type_arr[2];
                const test_value = '0123456789abcdef';
                res(Buffer.from(test_value,'hex')).should.be.equal(test_value);
            });
        });
        describe('STR_INT', ()=>{
            it('should return a number from a Buffer encoded string',()=>{
                const res = bt.filter(typ => (typ.name === 'U_TLAY'))[0].versions['01'][1][2];
                const test_value = 1234;
                const test_value_buf = Buffer.from(test_value.toString(10)); 
                res(test_value_buf).should.be.equal(test_value);
            });
        });
        describe('DB_DATETIME', ()=>{
            it('should return a Date from a Buffer encoded string',()=>{
                const data_type_arr = bt[0].versions['01'][3];
                const res = data_type_arr[2];
                const dummy_date_buf = Buffer.from('130419871215');
                const dummy_date = new Date(1987, 03, 13, 12, 15);
                res(dummy_date_buf).should.be.deep.equal(dummy_date);
            });
        });
    });
    describe('Special Types', ()=>{
        describe('EFS_DATA', ()=>{
            var res;
            var res2;
            var res_dc10;
            before((done)=>{
                const fn = bt.filter(typ => (typ.name === '0080VU'))[0].versions['01'][4][2];
                const test_buf = Buffer.from('130791f0187407d018763821000138221800000000130791f008dc060d18767a131c', 'hex');
                const test_buf_dc10 = Buffer.from('130791f0187407d018763821000138221800000000130791f008dc061018767a131c', 'hex');
                const double_test_buf = Buffer.from('130791f0187407d018763821000138221800000000130791f008dc060d18767a131c130791f0187407d018763821000138221800000000130791f008dc060d18767a131c', 'hex');
                res = fn(test_buf);
                res2 = fn(double_test_buf);
                res_dc10 = fn(test_buf_dc10);
                done();
            });
            it('should return an object',()=>{
                res.should.be.an('object');
            });
            it('should have property of property of berechtigungs_nr', ()=>{
                res['1'].should.have.property('berechtigungs_nr', 319263216);
            });
            
            it('should also work with mutliple tickets', () =>{
                res2['1'].should.have.property('berechtigungs_nr', 319263216);
            });
            it('should handle DC-typ 0x0d', ()=>{
                res['1'].should.have.nested.property('Liste_DC.typ_DC', '0d');
            });
            it('should handle DC-typ 0x10', ()=>{
                res_dc10['1'].should.have.nested.property('Liste_DC.typ_DC', '10');
            });
        });
    });
})


// berechtigungs_nr: 319263216,
//      kvp_organisations_id: 6260,
//      produkt_nr: 2000,
//      pv_organisations_id: 6262,
//      valid_from: undefined,
//      valid_to: undefined,
//      preis: 0,
//      sam_seqno: 319263216,
//      lengthList_DC: 8,