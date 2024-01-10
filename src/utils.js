exports.stringifyBufferObj = function (obj) {
  for (const key in obj) {
    if (Buffer.isBuffer(obj[key])) {
      obj[key] = obj[key].toString()
    }
  }
  return obj
}

exports.interpretField = function (data, fields) {
  let remainder = data
  const res = {}
  fields.forEach(f => {
    let interpretFunction
    if (f[2]) {
      interpretFunction = f[2]
    } else {
      interpretFunction = (x) => x
    }
    if (f[1]) {
      res[f[0]] = interpretFunction(remainder.slice(0, f[1]))
      remainder = remainder.slice(f[1])
    } else {
      res[f[0]] = interpretFunction(remainder)
    }
  })
  return res
}

exports.parseContainers = function (data, f) {
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

function myConsoleLogFn (str) {
  /* following if statement is never fired up during test, so should be ignored */
  /* istanbul ignore if  */
  if (process.env.NODE_ENV !== 'test') { console.error(str) }
}

exports.myConsoleLog = myConsoleLogFn

function pad (number, length) {
  let str = '' + number
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

exports.pad = pad

exports.assignArrayToObj = (arr) => {
  const reducer = (accumulator, currentValue) => Object.assign({}, accumulator, currentValue)
  return arr.reduce(reducer)
  // var obj = Object.assign({}, o1, o2, o3);
}

exports.arrayDefinedAndNotEmpty = (arr) => {
  return (typeof arr !== 'undefined' && arr.length > 0)
}
