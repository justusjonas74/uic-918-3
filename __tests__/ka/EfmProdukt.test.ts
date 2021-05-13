import { EfmProdukt } from "../../src/ka/EfmProdukt"
import { Organisation} from "../../src/ka/Organisation"
import { Produkt } from "../../src/ka/Produkt"

describe('EfmProdukt class', ()=>{
    const cityMobil = EfmProdukt.getProduct(6263,1001) // City-mobil Tageskarte
    const unkwnonTicket = EfmProdukt.getProduct(6263,1)
    const unknownOrganisation = EfmProdukt.getProduct(1,1)
    
    const vvo = new Organisation(6060, "VVO")
    const tageskarte = new Produkt(1, "VVO-Tageskarte")
    const vvoTageskarte = new EfmProdukt(vvo,tageskarte)
    const vvoUnknownProduct = new EfmProdukt(vvo, new Produkt(2))
    
    describe("name()", ()=>{
        it('should handle new initialized products', ()=>{
            expect(vvoTageskarte.name).toBe("VVO-Tageskarte")
            expect(vvoUnknownProduct.name).toBe("??? (2)")
        })
    }) 

    describe("getProduct()", ()=>{
        it("should recognize known products", () => {
            expect(cityMobil.name).toBe("City-mobil Tageskarte")
        })
        it("should handle unknown products", ()=>{
            expect(unkwnonTicket.name).toBe("??? (1)")
        })
        it("should handle unknown organisations", ()=>{
            expect(unknownOrganisation.name).toBe("??? (1)")
        })
    })


})