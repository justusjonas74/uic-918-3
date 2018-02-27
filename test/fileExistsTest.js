var chai = require('chai')
var dirtyChai = require('dirty-chai')
chai.use(dirtyChai)

chai.should()

const path = require('path')

const fileExists = require('../lib/fileExists')

describe('fileExists', () => {
  var filePath = {}

  beforeEach((done) => {
    const file = 'index.js'
    filePath.relative_true = file
    filePath.relative_false = file + '1458'
    filePath.absolute_true = path.resolve(file)
    filePath.absolute_false = path.resolve(file) + '254'
    done()
  })
  it('should return false if no file path given', () => {
    fileExists(null).should.be.false()
  })
  it('should return false if a file with relative path isn\'t found', () => {
    fileExists(filePath.relative_false).should.be.false()
  })
  it('should return true if a file with relative path is found', () => {
    fileExists(filePath.relative_true).should.be.true()
  })
  it('should return false if a file with absolute path isn\'t found', () => {
    fileExists(filePath.absolute_false).should.be.false()
  })
  it('should return true if a file with absolute path is found', () => {
    fileExists(filePath.absolute_true).should.be.true()
  })
})
