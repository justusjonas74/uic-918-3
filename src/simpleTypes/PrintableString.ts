import { ElementaryType, ElementaryTypes } from "./ElementaryType";


export class PrintableString extends ElementaryType {
    constructor(buffer: Buffer, name = ""){
        super(buffer, name)
        this.type = ElementaryTypes.PrintableString
    }

    get value():string {
        return this.buffer.toString('ascii')
    }
}
