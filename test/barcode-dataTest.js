var should = require('chai').should();
var zlib = require('zlib');

const bcd = require('../lib/barcode-data');

describe('barcode-data', ()=>{
    describe('barcode-data.interpret', ()=>{
        it('should return an object', ()=>{
           const ticket_data = Buffer.from('2355543031303038303030303036302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b0000000030323837789c65503b4ec34010b51b424395c60585810e643433fbf12e5d888d8c14a56095b4c80113b909911345825b701f3a2ec00138044760c68084c46aa57dfbdedb999d37bbadca510108601480830abd45cc74f46711330498a3665f5116a5182f27a080bc0585cc8aee7e4fca9dd7a80d456803486df0615d77ebae69374c1013480c94801103cfc062c67d7d901af288816640819d6818999bb6d9d47cb12cebe9db6bb75a34ddf26cdc6e9f02104abde9fc7492558b8714cd8576e9f5b844832a933347c52e6e89aa786c964d7ad5d5ab3bf91059e9d3cb4ee41fe1a4b705195066c073de321e33f48fe93f881c48ce17a9a7c869c9693efb0e37bae724e3783878f94cb683f764e78ea2d81d2712b090fb1f7b07c9ee7978f80598b65bdd', 'hex');
           bcd.interpret(ticket_data).should.be.an('object');
        });
        //FIXIT: this test fails actually, because of zlib.unzipSync(data).
        // Maybe it's a better solution to return null.
        it('should return an empty array if input param is an empty buffer.', ()=>{
            bcd.interpret(Buffer.from('')).ticketContainers.should.be.an('array').and.be.empty;
        });
        
        describe('on unknown data fieleds', ()=>{
          var results;
          beforeEach((done)=>{
            const ticket_header = Buffer.from('2355543031303038303030303036302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000','hex');
            const sensless_container = Buffer.from('MYID!!'+'01'+'0016'+'Test');
            const compressed_ticket = zlib.deflateSync(sensless_container);
            const sensless_container_length = Buffer.from('00'+compressed_ticket.length);
            const ticket_arr =[ticket_header, sensless_container_length, compressed_ticket];
            const totalLength = ticket_arr.reduce((result, item) => result + item.length,0);
            const ticket = Buffer.concat(ticket_arr,totalLength);
            results = bcd.interpret(ticket).ticketContainers;
            done()
          })
            it('should ignore unkown data fields', ()=>{
             results.should.not.be.empty;
            });
            it('should parse the unknown container id', () => {
                results[0].id.should.be.equal('MYID!!');
            });
            it('should not touch/parse the container data',()=>{
                results[0].container_data.should.be.deep.equal(Buffer.from('Test'));
            })
        })
       describe('on unknown data fieds versions but known id', ()=>{
          var results;
          beforeEach((done)=>{
            const ticket_header = Buffer.from('2355543031303038303030303036302c021402a7689c8181e5c32b839b21f603972512d26504021441b789b47ea70c02ae1b8106d3362ad1cd34de5b00000000','hex');
            const sensless_container = Buffer.from('U_HEAD'+'03'+'0016'+'Test');
            const compressed_ticket = zlib.deflateSync(sensless_container);
            const sensless_container_length = Buffer.from('00'+compressed_ticket.length);
            const ticket_arr =[ticket_header, sensless_container_length, compressed_ticket];
            const totalLength = ticket_arr.reduce((result, item) => result + item.length,0);
            const ticket = Buffer.concat(ticket_arr,totalLength);
            results = bcd.interpret(ticket).ticketContainers;
            done()
          })
            it('should ignore unkown versions of data fields', ()=>{
             results.should.not.be.empty;
            });
            it('should parse the unknown container id', () => {
                results[0].id.should.be.equal('U_HEAD');
            });
            it('should not touch/parse the container data',()=>{
                results[0].container_data.should.be.deep.equal(Buffer.from('Test'));
            })
        })
       
    });
});