import { ElementaryType, ElementaryTypes } from "./ElementaryType";

export class StringifiedInteger extends ElementaryType {
    constructor(buf:Buffer, name?: string) {
        super(buf, name)
        this.type = ElementaryTypes.StringifiedInteger
    }
    get value ():string {
        return parseInt(this.buffer.toString(), 10).toString()
    }
} 