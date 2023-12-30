const zlib = require('zlib')

const BLOCK_TYPES = require('./block-types.js') // Array with objects
const utils = require('./utils.js')

// Get raw data and uncompress the TicketData
function getVersion (data) {
  return parseInt(data.slice(3, 5).toString(), 10)
}

function getHeader (data) {
  const header = {}
  header.umid = data.slice(0, 3)
  header.mt_version = data.slice(3, 5)
  header.rics = data.slice(5, 9)
  header.key_id = data.slice(9, 14)
  return header
}

function getSignature (data, version) {
  if (version === 1) {
    return data.slice(14, 64)
  } else {
    return data.slice(14, 78)
  }
}

function getTicketDataLength (data, version) {
  if (version === 1) {
    return data.slice(64, 68)
  } else {
    return data.slice(78, 82)
  }
}

function getTicketDataRaw (data, version) {
  if (version === 1) {
    return data.slice(68, data.length)
  } else {
    return data.slice(82, data.length)
  }
}

function getTicketDataUncompressed (data) {
  if (data && data.length > 0) {
    return zlib.unzipSync(data)
  } else {
    return data
  }
}

// Interpreters for uncompressed Ticket Data
class TicketDataContainer {
  constructor (data) {
    this.id = data.slice(0, 6).toString()
    this.version = data.slice(6, 8).toString()
    this.length = parseInt(data.slice(8, 12).toString(), 10)
    // this.container_data = data.slice(12, data.length)
    this.container_data = this.parseFields(this.id, this.version, data.slice(12, data.length))
  }

  parseFields (id, version, data) {
    const fields = getBlockTypeFieldsByIdAndVersion(id, version)
    if (fields) {
      return utils.interpretField(data, fields)
    } else {
      utils.myConsoleLog(`ALERT: Container with id ${id} and version ${version} isn't implemented for TicketContainer ${id}.`)
      return data
    }
  }
}

function interpretTicketContainer (data) {
  const length = parseInt(data.slice(8, 12).toString(), 10)
  const remainder = data.slice(length, data.length)
  const container = new TicketDataContainer(data.slice(0, length))
  return [container, remainder]
}

function getBlockTypeFieldsByIdAndVersion (id, version) {
  const types = BLOCK_TYPES.filter(typ => (typ.name === id))
  if (utils.arrayDefinedAndNotEmpty(types)) {
    return types[0].versions[version]
  } else {
    return null
  }
}

module.exports = (data) => {
  const barcode = {}
  barcode.version = getVersion(data)
  barcode.header = getHeader(data)
  barcode.signature = getSignature(data, barcode.version)
  barcode.ticketDataLength = getTicketDataLength(data, barcode.version)
  barcode.ticketDataRaw = getTicketDataRaw(data, barcode.version)
  barcode.ticketDataUncompressed = getTicketDataUncompressed(barcode.ticketDataRaw)
  barcode.ticketContainers = utils.parseContainers(barcode.ticketDataUncompressed, interpretTicketContainer)
  return barcode
}
