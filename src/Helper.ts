// import { off } from "node:process"

// import { ElementaryType } from "./simpleTypes/ElementaryType"
// import { RCT2ContainerType } from "./uic/UIC_RCT2Block"


export class Helper {



    static removeLeadingZeroesFromStringNumber = (str:string) : string => {
        return str.replace(/^0+/, '')
      }

    static slicedRawData(data: Buffer, offset: number, end: number = data.length): Buffer {
        return data.slice(offset, end);
    }
    static slicedRawDataString(data: Buffer, offset: number, end: number = data.length): string {
        return this.slicedRawData(data, offset, end).toString();
    }
    static slicedRawDataNumber(data: Buffer, offset: number, end: number = data.length): number {
        return parseInt(Helper.slicedRawDataString(data, offset, end), 10);
    }
  
    static fromBufferWithRemainder<T>({ buffer, initializer }: fromBufferWithRemainderOptions<T> ): [T, Buffer?] {
        const options = {
            lengthFrom: 8 ,
            lengthTo: 12
        }

        const lengthFrom = options.lengthFrom
        const lengthTo = options.lengthTo
        
        const length = Helper.slicedRawDataNumber(buffer, lengthFrom, lengthTo)
        const slicedBuffer = Helper.slicedRawData(buffer, 0, length)
        const rct2Block = initializer(slicedBuffer)
        let remainder : Buffer | undefined = undefined
        if (buffer.length > length) {
            remainder = Helper.slicedRawData(buffer, length, buffer.length)
        }
        return [rct2Block,remainder]
    }
}


export type fromBufferWithRemainderOptions<T> = {
    buffer: Buffer;
    initializer: (x: Buffer) => T;
 }