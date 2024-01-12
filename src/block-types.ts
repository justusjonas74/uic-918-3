// const utils = require('./utils.js')
// const enums = require('./enums.js')

import { FieldsType, interpreterFunctionType } from "./FieldsType"
import { ticketContainer } from "./ticketContainer"

// ################
// DATA TYPES
// ################

export const STRING = (x: Buffer) => x.toString()
export const HEX = (x: Buffer) => x.toString('hex')
export const STR_INT = (x: Buffer) => parseInt(x.toString(), 10)
export const INT = (x: Buffer) => x.readUIntBE(0, x.length)
export const DB_DATETIME = (x: Buffer) => {
  // DDMMYYYYHHMM
  const day = STR_INT(x.subarray(0, 2))
  const month = STR_INT(x.subarray(2, 4)) - 1
  const year = STR_INT(x.subarray(4, 8))
  const hour = STR_INT(x.subarray(8, 10))
  const minute = STR_INT(x.subarray(10, 12))
  return new Date(year, month, day, hour, minute)
}
const KA_DATETIME = (x: Buffer) => {
  // ‘yyyyyyymmmmddddd’B + hhhhhmmmmmmsssss’B  (4 Byte)
  const dateStr = utils.pad(parseInt(x.toString('hex'), 16).toString(2), 32)
  const year = parseInt(dateStr.slice(0, 7), 2) + 1990
  const month = parseInt(dateStr.slice(7, 11), 2) - 1
  const day = parseInt(dateStr.slice(11, 16), 2)
  const hour = parseInt(dateStr.slice(16, 21), 2)
  const minute = parseInt(dateStr.slice(21, 27), 2)
  const sec = parseInt(dateStr.slice(27, 32), 2) / 2
  return new Date(year, month, day, hour, minute, sec)
}

const ORG_ID = (x) => {
  const id = INT(x)
  return enums.org_id(id)
}

const EFM_PRODUKT = (x) => {
  const orgId = INT(x.slice(2, 4))
  const produktNr = INT(x.slice(0, 2))
  return enums.efm_produkt(orgId, produktNr)
}
export const AUSWEIS_TYP = (x) => {
  const number = STR_INT(x)
  return enums.id_types.get(number).key
}

const DC_LISTE = (x) => {
  const res = {}
  res.dc_length = INT(x.slice(1, 2))
  res.typ_DC = HEX(x.slice(2, 3))
  res.pv_org_id = INT(x.slice(3, 5))
  const TP = splitDCList(res.dc_length, res.typ_DC, x.slice(5, x.length))
  // FIXIT: ADD A PARSER
  res.TP = TP.map((item) => enums.tarifpunkt(res.pv_org_id, item))

  return res
}

const EFS_FIELDS = [
  ['berechtigungs_nr', 4, INT],
  ['kvp_organisations_id', 2, ORG_ID],
  // ['produkt_nr', 2, INT],
  ['efm_produkt', 4, EFM_PRODUKT],
  ['valid_from', 4, KA_DATETIME],
  ['valid_to', 4, KA_DATETIME],
  ['preis', 3, INT],
  ['sam_seqno', 4, INT],
  ['lengthList_DC', 1, INT],
  ['Liste_DC', null, DC_LISTE]
]

export const EFS_DATA = (x) => {
  const lengthListDC = INT(x.slice(25, 26))
  const t = []
  if (lengthListDC + 26 < x.length) {
    t.push(x.slice(0, lengthListDC + 26))
    t.push(x.slice(lengthListDC + 26, x.length))
  } else {
    t.push(x.slice(0, lengthListDC + 26))
  }
  const res = {}
  t.forEach((ticket, index) => {
    res[1 + index] = utils.interpretField(ticket, EFS_FIELDS)
  })
  return res
}

function splitDCList(dcLength, typDC, data) {
  // 0x0D 3 Byte CT, CM
  // 0x10 2 Byte Länder,SWT, QDL
  let SEP
  if (parseInt(typDC, 16) === 0x10) {
    SEP = 2
  } else {
    SEP = 3
  }
  const amount = (dcLength - 3) / SEP
  const res = []
  for (let i = 0; i < amount; i++) {
    res.push(INT(data.slice(i * SEP, i * SEP + SEP)))
  }
  return res
}

function interpretRCT2Block(data) {
  const res = {}
  res.line = parseInt(data.slice(0, 2).toString(), 10)
  res.column = parseInt(data.slice(2, 4).toString(), 10)
  res.height = parseInt(data.slice(4, 6).toString(), 10)
  res.width = parseInt(data.slice(6, 8).toString(), 10)
  res.style = parseInt(data.slice(8, 9).toString(), 10)
  const length = parseInt(data.slice(9, 13).toString(), 10)
  res.value = data.slice(13, 13 + length).toString()
  const rem = data.slice(13 + length)
  return [res, rem]
}

export const RCT2_BLOCKS = (x) => {
  return utils.parseContainers(x, interpretRCT2Block)
}

const A_BLOCK_FIELDS_V2 = [
  ['certificate', 11, STRING],
  ['padding', 11, HEX],
  ['valid_from', 8, STRING],
  ['valid_to', 8, STRING],
  ['serial', 8, STRING]
]

const A_BLOCK_FIELDS_V3 = [
  ['valid_from', 8, STRING],
  ['valid_to', 8, STRING],
  ['serial', 10, STRING]
]

function interpretSingleSBlock(data) {
  const res = {}
  const type = enums.sBlockTypes.get(parseInt(data.slice(1, 4).toString(), 10))
  const length = parseInt(data.slice(4, 8).toString(), 10)
  res[type] = data.slice(8, 8 + length).toString()
  const rem = data.slice(8 + length)
  return [res, rem]
}

export const auftraegeSBlocksV2 = (x) => {
  const A_LENGTH = 11 + 11 + 8 + 8 + 8
  return auftraegeSblocks(x, A_LENGTH, A_BLOCK_FIELDS_V2)
}

export const auftraegeSBlocksV3 = (x) => {
  const A_LENGTH = 10 + 8 + 8
  return auftraegeSblocks(x, A_LENGTH, A_BLOCK_FIELDS_V3)
}

function auftraegeSblocks(x, A_LENGTH, fields) {
  const res = {}
  res.auftrag_count = parseInt(x.slice(0, 1).toString(), 10)
  for (let i = 0; i < res.auftrag_count; i++) {
    const bez = `auftrag_${i + 1}`
    res[bez] = utils.interpretField(x.slice(1 + (i * A_LENGTH), (i + 1) * A_LENGTH + 1), fields)
  }
  res.sblock_amount = parseInt(x.slice(A_LENGTH * res.auftrag_count + 1, A_LENGTH * res.auftrag_count + 3).toString(), 10)
  res.sblocks = utils.assignArrayToObj(utils.parseContainers(x.slice(A_LENGTH * res.auftrag_count + 3), interpretSingleSBlock))
  return res
}



// ################
// DATA FIELDS
// ################
type TicketContainerTypeVersions = '01' | '02' | '03'

export interface TicketContainerType {
  name: string,
  version: TicketContainerTypeVersions
  dataFields: FieldsType[]
}

export default ticketContainer