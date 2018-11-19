var fs = require('fs')
const path = require('path')
const myConsoleLogFn = require('./utils.js').myConsoleLog

const fileWithAbsolutePathExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    return true
  } else {
    myConsoleLogFn(`ERROR: ${filePath} not found.`)
    return false
  }
}

const fileExists = (filePath) => {
  if (!filePath) {
    myConsoleLogFn('No path passed.')
    return false
  }
  if (path.isAbsolute(filePath)) {
    return fileWithAbsolutePathExists(filePath)
  } else {
    const absolutePath = path.join(process.cwd(), filePath)
    return fileWithAbsolutePathExists(absolutePath)
  }
}

const fileWillExists = (filePath) => {
  return new Promise((resolve, reject) => {
    if (fileExists(filePath)) {
      resolve(filePath)
    } else {
      reject(new Error(`${filePath} not found.`))
    }
  })
}

// promisify fs.readFile()
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, function (err, buffer) {
      if (err) reject(err); else resolve(buffer)
    })
  })
}

const tryToLoadFile = (input) => {
  return new Promise((resolve, reject) => {
    fileWillExists(input)
          .then(input => readFileAsync(input))
          .then(buffer => resolve(buffer))
          .catch(error => reject(error))
  })
}

// const loadFileOrBuffer = (input, stringCallback = null, bufferCallback = null, defaultCallback = null) => {
const loadFileOrBuffer = (input) => {
  if (typeof input === 'string') {
    // return stringCallback ? stringCallback(input) : tryToLoadFile(input)
    return tryToLoadFile(input)
  } else if (input instanceof Buffer) {
    // return bufferCallback ? bufferCallback(input) : Promise.resolve(input)
    return Promise.resolve(input)
  } else {
    // return defaultCallback ? defaultCallback(input) : Promise.reject(new Error(`Error: Input must be a Buffer (Image) or a String (path to image)`))
    return Promise.reject(new Error(`Error: Input must be a Buffer (Image) or a String (path to image)`))
  }
}

module.exports = {fileWillExists, fileExists, loadFileOrBuffer, readFileAsync}
