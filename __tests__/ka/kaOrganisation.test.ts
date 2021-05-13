import { Organisation } from "../../src/ka/Organisation";

describe('Organisation class', () => {
  const unknownOrg = new Organisation(123)
  const oneOrg = new Organisation(1)
  const unknownOrgWithName = new Organisation(456, "SuperOrg")
  const vdv = new Organisation(5000)
  const db = new Organisation(6262)


  describe('name', ()=>{
      it('should return the id as a string if no name is in initialized', ()=>{
          expect(unknownOrg.name).toBe("123")
      })
      it('should return the name if a name is initialized', ()=>{
        expect(unknownOrgWithName.name).toBe("SuperOrg")
      })
      it('should return the name if no name is initialized, but organisation is konwn', ()=>{
        expect(db.name).toBe("DB Fernverkehr")
        expect(vdv.name).toBe("VDV E-Ticket Service")
      })
      it('name should be accessible', ()=>{
        expect(oneOrg.name).toBe("1")
        oneOrg.name = "Two Org"
        expect(oneOrg.name).toBe("Two Org")
      })
  })
});
