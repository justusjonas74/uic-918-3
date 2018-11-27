import chai = require('chai');
var should = chai.should();

import {Organisation, OrganisationenPool, Produkt} from '../lib/vdvKaTypes'


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
    describe('addProducts()', ()=>{
      it('should have a method addProducts', ()=>{
        organisation.should.respondTo('addProducts')
      })
      it('should add Products', ()=>{
        const liste = {12: new Produkt(12, "Banane")}
        organisation.addProducts(liste)
        organisation.products.should.have.property("12")
      })
    }) 
    // THIS SOLUTION CREATES A MEMORY LEAK
    // it('Class itself should hav a static method \'getByID\'', ()=>{
    //   Organisation.should.itself.respondTo('getByID')
    // })
    // it('\'getByID\' method should return an instance of Organisation, if id exists', ()=>{
    //   const org = Organisation.getByID(15)
    //   org!.should.be.an.instanceof(Organisation)
    // })
    // it('\'getByID\' method should return null, if id does not exist', ()=>{
    //   const org = Organisation.getByID(13)
    //   should.equal(org!, null)
    // })

    // it('Class itself should respondTo \'getNameByID\'', ()=>{
    //   Organisation.should.itself.respondTo('getByID')
    // })
    // it('\'getNameByID\' method should return a string with  Organisation name, if id exists', ()=>{
    //   const name = Organisation.getNameByID(15)
    //   name.should.be.equal("Super Organisation")
    // })    
    // it('\'getNameByID\' method should return the input, if id does not exist', ()=>{
    //   const name = Organisation.getNameByID(13)
    //   name.should.be.equal("13")
    // })
    
    // it('\'getByID\' should handle destroyed instances', ()=>{

    
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
    it('Class itself should respondTo \'getNameByID\'', ()=>{
      result.should.itself.respondTo('getByID')
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
  describe('Class Produkt', ()=>{
    const result = new Produkt(123, "Bestseller")
    it('should return an instance of Class Produkt',()=>{
      result.should.be.an.instanceof(Produkt)
    })
    it('should have a property of id which is a number', ()=>{
      result.id.should.be.a("number")
    })    
    it('should have a property of id which returns the input number', ()=>{
      result.id.should.be.equal(123)
    })
    it('should have a property of \'name\' which is a string', ()=>{
      result.name.should.be.a("string")
    })    
    it('should have a property of \'name\' which returns the input nameText', ()=>{
      result.name.should.be.equal("Bestseller")
    })
  })
})

