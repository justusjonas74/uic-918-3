import chai = require('chai');
var should = chai.should();

import {Organisation, OrganisationenPool} from '../lib/vdvKaTypes'


describe('vdvKaTypes.ts', ()=>{
  describe('Class Organisation', ()=>{
    const organisation = new Organisation(15, 'Super Organisation')
    it('should return an instance of Organsiation', ()=>{
      organisation.should.be.an.instanceof(Organisation)
    })
    it('should respond to a \'name\' method', ()=>{
      organisation.should.have.property('name')
    })
    it('\'name\' method should return the name as a string', ()=>{
      organisation.name.should.be.equal("Super Organisation")
      organisation.name.should.be.a("string");
    })  
    it('should respond to a \'id\' method', ()=>{
      organisation.should.have.property('id')
    })
    it('\'id\' method should return the id as a number', ()=>{
      organisation.id.should.be.equal(15)
      organisation.id.should.be.a("number");
    })
  })
  describe('Class OrganisationenPool', ()=>{
    const liste = {
      12: new Organisation(12, 'Hallo'),
      87: new Organisation(87, 'Welt!')
    }
    const result = new OrganisationenPool(liste)
    
    it('should return an instance of type OrganisationenPool', ()=>{
      result.should.be.an.instanceof(OrganisationenPool)
    })
    it('should respondTo \'getByID\'', ()=>{
      result.should.respondTo('getByID')
    })
    
    it('\'getByID\' method should return an instance of Organisation, if id exists', ()=>{
      const org = result.getByID(12)
      org!.should.be.an.instanceof(Organisation)
    })    
    it('\'getByID\' method should return null, if id does not exist', ()=>{
      const org = result.getByID(13)
      should.equal(org!, null)
    })
    it('should respondTo \'getNameByID\'', ()=>{
      result.should.respondTo('getByID')
    })
    it('\'getNameByID\' method should return a string with  Organisation name, if id exists', ()=>{
      const name = result.getNameByID(12)
      name.should.be.equal("Hallo")
    })    
    it('\'getNameByID\' method should return the input, if id does not exist', ()=>{
      const name = result.getNameByID(13)
      name.should.be.equal("13")
    })
  })
})

