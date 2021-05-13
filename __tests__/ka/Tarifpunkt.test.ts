import { Organisation } from "../../src/ka/Organisation"
import { Tarifpunkt } from "../../src/ka/Tarifpunkt"


describe('Tarifpunkt class', ()=>{
    const dbRegioZwickau = Tarifpunkt.getByIdAndOrg(8010397,new Organisation(6263))
    const dbFernDresden = Tarifpunkt.getByIdAndOrg(8010085,new Organisation(6262))
    const vdvSachsen = Tarifpunkt.getByIdAndOrg(14, new Organisation(5000))
    const unknownTarifpunktOfKnownOrgansisation = Tarifpunkt.getByIdAndOrg(140, new Organisation(5000))
    const unknownTarifpunktOfUnknownOrgansisation = Tarifpunkt.getByIdAndOrg(15, new Organisation(12))
    const variableTarifpunkt = new Tarifpunkt(12, new Organisation(1))
    
    
    describe("tarifpunktName()", ()=>{
        it('should return a default name if Tarifpunkt is known', ()=>{
            expect(dbFernDresden.tarifpunktName).toBe("Dresden Hbf")
            expect(dbRegioZwickau.tarifpunktName).toBe("Zwickau(Sachs)Hbf")
            expect(vdvSachsen.tarifpunktName).toBe("Sachsen")
        })
        it('should return the id/tarifpunktNummer if Tarifpunkt is unknown', ()=>{
            expect(unknownTarifpunktOfKnownOrgansisation.tarifpunktName).toBe("140")
        })
        it('should return the id/tarifpunktNummer if Organisation is unknown', ()=>{
            expect(unknownTarifpunktOfUnknownOrgansisation.tarifpunktName).toBe("15")
        })
        it('should be accessible', ()=>{
            expect(variableTarifpunkt.tarifpunktName).toBe("12")
            variableTarifpunkt.tarifpunktName = "Radebeul - Schildenstraße"
            expect(variableTarifpunkt.tarifpunktName).toBe("Radebeul - Schildenstraße")
        })
    }) 
})