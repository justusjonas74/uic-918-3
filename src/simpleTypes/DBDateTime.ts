import { ElementaryType, ElementaryTypes } from "./ElementaryType";

export class DBDateTime extends ElementaryType {

    private date : Date
    
    constructor(buf:Buffer, name?:string) {
        super(buf,name)
        this.type = ElementaryTypes.DBDateTime
        const STR_INT = (x:Buffer) => parseInt(x.toString(), 10)
        const day = STR_INT(buf.slice(0, 2))
        const month = STR_INT(buf.slice(2, 4)) - 1
        const year = STR_INT(buf.slice(4, 8))
        const hour = STR_INT(buf.slice(8, 10))
        const minute = STR_INT(buf.slice(10, 12))
        this.date = new Date(year, month, day, hour, minute)
    }
    get value () :string {
        return this.date.toString()
    }
}