// 2024-01-10 seems not to be used anymore...
// exports.stringifyBufferObj = function (obj) {
//   for (const key in obj) {
//     if (Buffer.isBuffer(obj[key])) {
//       obj[key] = obj[key].toString()
//     }
//   }
//   return obj
// }

import { FieldsType, SupportedTypes } from "./FieldsType"

export type interpretFieldResult = { [index: string]: SupportedTypes }

export function interpretField(data: Buffer, fields: FieldsType[]) : interpretFieldResult {
  let remainder = data
  const res: interpretFieldResult = {}
  fields.forEach(field => {
    const { name, interpreterFn, length } = field
    const interpreterFnDefault = (x: Buffer) : Buffer => x
    const interpretFunction = interpreterFn || interpreterFnDefault

    if (length) {
      res[name] = interpretFunction(remainder.subarray(0, length))
      remainder = remainder.subarray(length)
    } else {
      res[name] = interpretFunction(remainder)
    }
  })
  return res
}


// f is a function which returns an array with a interpreted value from data and the remaining data as the second item
export type parsingFunction = (data: Buffer) => [SupportedTypes, Buffer?]
export function parseContainers(data: Buffer, f: parsingFunction): SupportedTypes[] {
  // f is a function which returns an array with a interpreted value from data and the remaining data as the second item
  let remainder = data
  const containers = []
  while (remainder.length > 0) {
    const result = f(remainder)
    containers.push(result[0])
    remainder = result[1]
  }
  return containers
}

export function myConsoleLog(str: string) : void {
  /* following if statement is never fired up during test, so should be ignored */
  /* istanbul ignore if  */
  if (process.env.NODE_ENV !== 'test') { console.error(str) }
}

export function pad(number: number | string, length: number):string {
  let str = '' + number
  while (str.length < length) {
    str = '0' + str
  }
  return str
}