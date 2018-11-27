// Does not to be used....

// export function stringifyBufferObj (obj) {
//   for (const key in obj) {
//     if (Buffer.isBuffer(obj[key])) {
//       obj[key] = obj[key].toString()
//     }
//   }
//   return obj
// }




export function myConsoleLog (str:string) : void  {
  /* following if statement is never fired up during test, so should be ignored */
  /* istanbul ignore if  */
  if (process.env.NODE_ENV !== 'test') { console.error(str) }
}

// export function pad (number, length) {
//   var str = '' + number
//   while (str.length < length) {
//     str = '0' + str
//   }
//   return str
// }

// export function arrayDefinedAndNotEmpty (arr) {
//   return (typeof arr !== 'undefined' && arr.length > 0)
// }

// export function interpretField (data, fields) {
//   var remainder = data
//   var res = {}
//   fields.forEach(f => {
//     var interpretFunction
//     if (f[2]) {
//       interpretFunction = f[2]
//     } else {
//       interpretFunction = (x) => x
//     }
//     if (f[1]) {
//       res[f[0]] = interpretFunction(remainder.slice(0, f[1]))
//       remainder = remainder.slice(f[1])
//     } else {
//       res[f[0]] = interpretFunction(remainder)
//     }
//   })
//   return res
// }

// export function parseContainers (data, f) {
//   // f is a function which returns an array with a interpreted value from data and the remaining data as the second item
//   var remainder = data
//   var containers = []
//   while (remainder.length > 0) {
//     const result = f(remainder)
//     containers.push(result[0])
//     // if (containers.length < 10 ) {console.log(containers)};
//     remainder = result[1]
//   }
//   return containers
// }
