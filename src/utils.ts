// 2024-01-10 seems not to be used anymore...
// exports.stringifyBufferObj = function (obj) {
//   for (const key in obj) {
//     if (Buffer.isBuffer(obj[key])) {
//       obj[key] = obj[key].toString()
//     }
//   }
//   return obj
// }


export type SupportedTypes = Date | string | number | Buffer // TODO: Stupid Solution

export interface FieldsType {
  length?: number,
  name: string,
  interpreterFn?: (x: Buffer) => SupportedTypes
}

type interpretFieldResult = { [index: string]: SupportedTypes }

export function interpretField(data: Buffer, fields: FieldsType[]) {
  let remainder = data
  const res: interpretFieldResult = {}
  fields.forEach(field => {
    const { name, interpreterFn, length } = field
    const interpreterFnDefault = (x: Buffer) => x
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
    // if (containers.length < 10 ) {console.log(containers)};
    remainder = result[1]
  }
  return containers
}

export function myConsoleLog(str: string) {
  /* following if statement is never fired up during test, so should be ignored */
  /* istanbul ignore if  */
  if (process.env.NODE_ENV !== 'test') { console.error(str) }
}



export function pad(number: number | string, length: number) {
  let str = '' + number
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

export function assignArrayToObj(arr: object[]) {
  // const reducer = (accumulator, currentValue) => Object.assign({}, accumulator, currentValue)
  // return arr.reduce(reducer)
  // // var obj = Object.assign({}, o1, o2, o3);
  const initialValue = {};
  return arr.reduce((obj, item) => {
    return {
      ...obj,
      ...item,
    };
  }, initialValue);
}
  
