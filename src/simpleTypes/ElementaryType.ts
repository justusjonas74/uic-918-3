export enum ElementaryTypes {
    NoTypeSpecified = "No type specified",
    PrintableString = "Printable String",
    UICSignature = "UIC Signature",
    DBDateTime = "DateTime (DB)",
    StringifiedInteger = "Stringified Integer"
}


export class ElementaryType implements IElementaryTypes {

    type: ElementaryTypes

    constructor(
        readonly buffer : Buffer,
        readonly name = ""
        ){
            this.type = ElementaryTypes.NoTypeSpecified
        }
    
    // static init<T extends ElementaryType>(buffer: Buffer, name?: string) : T {
    //     return new T(buffer, name)
    // }    

    hexString(withPrefix = true ) : string {
        const prefix = withPrefix ? "0x" : ""
        return  prefix + this.buffer.toString('hex')
    }

    get hex(): string {
        return this.hexString()
    }

    get value () :string {
        return this.buffer.toString('hex')
    }

    get typeName () : string {
        return this.type.toString()
    }
}


interface IElementaryTypes {
    name:  string,
    typeName: string,
    value:  string,
    hex: string,
}

