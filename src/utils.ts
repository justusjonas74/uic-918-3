// export function myConsoleLog (str:string) : void  {
//   /* following if statement is never fired up during test, so should be ignored */
//   /* istanbul ignore if  */
//   if (process.env.NODE_ENV !== 'test') { console.error(str) }
// }

export function pad (numberAsString: string, length:number) : string {
  let str = numberAsString
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

// export function arrayDefinedAndNotEmpty (arr) {
//   return (typeof arr !== 'undefined' && arr.length > 0)
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
