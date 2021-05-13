import { fromBufferWithRemainderOptions, Helper } from "../Helper"
import { ElementaryType } from "../simpleTypes/ElementaryType"
import { UICDataContainer } from "./UICDataContainer"

// Interpreters for uncompressed Ticket Data
export class UICRCT2Block {

    private static interpretField (data:Buffer, fields:RCT2Field[]): ElementaryType[] {
        let remainder = data
        const result : ElementaryType[] = fields.map( field => {
            const [name, length, fieldType] = field
            const returnType = fieldType || ElementaryType;

            if(!length) {
                return new returnType(remainder, name) 
            }
            
            const payload = remainder.slice(0, length)
            remainder = remainder.slice(length)
            return new returnType(payload, name)
        })
        return result
    }

    private static containerArray : RCT2ContainerType[] =  UICDataContainer

    static getContainerType (id:string, version: number) : RCT2ContainerType | undefined {
        return this.containerArray.find(containerType => {
            return (containerType.name === id && containerType.version === version)
        })
    } 

    static fromBufferWithRemainder(buffer: Buffer):[UICRCT2Block, Buffer?] {
        const initializer = (buffer:Buffer) => {return new UICRCT2Block(buffer)}

        type Options = fromBufferWithRemainderOptions<UICRCT2Block>

        const args: Options = {
            buffer: buffer,
            initializer: initializer
        }
        return Helper.fromBufferWithRemainder(args)
    }

    // TO DO: Change the Return Value 
    static parseFields (id:string, version:number, data: Buffer): ElementaryType[] | undefined {
        // TODO BEGIN
        const containerType = this.getContainerType(id, version)
        if (!containerType) {
            console.log(`Warning: Container with id ${id} and version ${version} is unknown. Couldn't parse data`)
            return undefined
        }
        return UICRCT2Block.interpretField(data, containerType.handlers)
    } 

    constructor (
        private _rawData : Buffer) {}
    
    slicedRawData(offset:number,length: number = this._rawData.length) : Buffer {
        const data = this._rawData
        return Helper.slicedRawData(data, offset, length)
    }
    slicedRawDataString(offset:number, length:number) : string {
        const data = this._rawData
        return Helper.slicedRawData(data, offset,length).toString()
    }

    slicedRawDataNumber(offset:number, length:number):number {
        const data = this._rawData
        return parseInt(Helper.slicedRawDataString(data, offset,length), 10)
    }   
    
    get id() : string {
        return this.slicedRawDataString(0,6)
    }

    get version() : number {
        return this.slicedRawDataNumber(6,8)
    }

    get length () : number {
        return this.slicedRawDataNumber(8,12)
    }

    get parsedData () : ElementaryType[] {
        const containerContent = this.slicedRawData(12) 
        return UICRCT2Block.parseFields(this.id, this.version, containerContent)
    }
    
  }
  
//   function interpretTicketContainer (data) {
//     const length = parseInt(data.slice(8, 12).toString(), 10)
//     const remainder = data.slice(length, data.length)
//     const container = new TicketDataContainer(data.slice(0, length))
//     return [container, remainder]
//   }
  
  
export type RCT2ContainerType = {
    name:string,
    version: number
    // handlers : RCT2Field<ElementaryType>[]
    handlers : RCT2Field[]
  }
  
  type RCT2Field= [string, number?, (typeof ElementaryType)?]
//   type RCT2Field<T> = [string, number, (x: Buffer, name?: string) => T]
  