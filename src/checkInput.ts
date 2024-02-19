import { PathLike, PathOrFileDescriptor, existsSync, readFile } from 'fs'
import { isAbsolute, join } from 'path'
import { myConsoleLog } from './utils'

const fileWithAbsolutePathExists = (filePath: PathLike): boolean => {
  if (existsSync(filePath)) {
    return true
  } else {
    myConsoleLog(`ERROR: ${filePath} not found.`)
    return false
  }
}

export const fileExists = (filePath: string):boolean => {
  if (!filePath) {
    myConsoleLog('No path passed.')
    return false
  }
  if (isAbsolute(filePath)) {
    return fileWithAbsolutePathExists(filePath)
  } else {
    const absolutePath = join(process.cwd(), filePath)
    return fileWithAbsolutePathExists(absolutePath)
  }
}

export const fileWillExists = (filePath: string) : Promise<string>=> {
  return new Promise<string>((resolve, reject) => {
    if (fileExists(filePath)) {
      resolve(filePath)
    } else {
      reject(new Error(`${filePath} not found.`))
    }
  })
}

// promisify fs.readFile()
export const readFileAsync = (filename: PathOrFileDescriptor): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    readFile(filename, function (err, buffer) {
      if (err) reject(err); else resolve(buffer)
    })
  })
}

const tryToLoadFile = (input: string):Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    fileWillExists(input)
      .then(input => readFileAsync(input))
      .then(buffer => resolve(buffer))
      .catch(error => reject(error))
  })
}

// const loadFileOrBuffer = (input, stringCallback = null, bufferCallback = null, defaultCallback = null) => {
export const loadFileOrBuffer = (input: PathLike): Promise<Buffer> => {
  if (typeof input === 'string') {
    // return stringCallback ? stringCallback(input) : tryToLoadFile(input)
    return tryToLoadFile(input)
  } else if (input instanceof Buffer) {
    // return bufferCallback ? bufferCallback(input) : Promise.resolve(input)
    return Promise.resolve(input)
  } else {
    // return defaultCallback ? defaultCallback(input) : Promise.reject(new Error(`Error: Input must be a Buffer (Image) or a String (path to image)`))
    return Promise.reject(new Error('Error: Input must be a Buffer (Image) or a String (path to image)'))
  }
}
