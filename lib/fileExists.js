var fs = require('fs')
const path = require('path')
const myConsoleLogFn = require('./utils.js').myConsoleLog

function fileWithAbsolutePathExists (filePath) {
  if (fs.existsSync(filePath)) {
    return true
  } else {
    myConsoleLogFn(`ERROR: ${filePath} not found.`)
    return false
  }
}

module.exports = (filePath) => {
  if (!filePath) {
    // if (process.env.NODE_ENV !== 'test') {console.error('No path passed.')}
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
