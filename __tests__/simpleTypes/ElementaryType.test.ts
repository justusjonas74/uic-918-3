import { ElementaryType, ElementaryTypes } from "../../src/simpleTypes/ElementaryType"

describe("Printable String class", ()=>{
    const buffer = Buffer.from("30303030323234", 'hex')
    const result = new ElementaryType(buffer, "buff buff")

    it("should return an new instance of type Printable String", ()=>{
        expect(result instanceof ElementaryType).toBeTruthy()
    } )

    it("should have a property name",()=>{
        expect(result).toHaveProperty('name', "buff buff")
    })
    it("should have a property name with an empty string as default",()=>{
        const result2 = new ElementaryType(buffer)
        expect(result2).toHaveProperty('name', "")
    })

    it("should have a property hex",()=>{
        expect(result).toHaveProperty('hex', "0x30303030323234")
    })

    describe("hexString method",()=>{
        it("should work without a prefix",()=>{
            expect(result.hexString()).toBe( "0x30303030323234")
        })
        it("should accept a boolean parameter", () => {
            expect(result.hexString(true)).toBe("0x30303030323234")
            expect(result.hexString(false)).toBe("30303030323234")
        })
    })
    it("should have a property buffer",()=>{
        expect(result).toHaveProperty('buffer')
        expect(result.buffer).toStrictEqual(buffer)
    })
    it("should have a property type",()=>{
        expect(result).toHaveProperty('type')
        expect(result.type).toStrictEqual(ElementaryTypes.NoTypeSpecified)
    })

    it("should have a property typeName",()=>{
        expect(result).toHaveProperty('typeName')
        expect(result.typeName).toStrictEqual("No type specified")
    })
    it("should have a property vale",()=>{
        expect(result).toHaveProperty('value')
        expect(result.value).toStrictEqual("30303030323234")
    })
})