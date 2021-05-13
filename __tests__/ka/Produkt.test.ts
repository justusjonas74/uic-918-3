import { Produkt } from "../../src/ka/Produkt"

describe("Produkt class", ()=>{

    const produktWithName = new Produkt(1, "test")
    const produktWithoutName = new Produkt(1)

    describe("produktname property", ()=>{
        it('should return a name if initialized', ()=>{
             expect(produktWithName.produktname).toBe("test")
        })
           
        it('should return a number as a string if no name is initialized', ()=>{
            expect(produktWithoutName.produktname).toBe("??? (1)")
        })

        it('should be accecible', ()=>{
            const anotherProduktWithName = new Produkt(1, "test")
            expect(anotherProduktWithName.produktname).toBe("test")
            anotherProduktWithName.produktname = "Hello!"
            expect(anotherProduktWithName.produktname).toBe("Hello!")
        })

    })
})