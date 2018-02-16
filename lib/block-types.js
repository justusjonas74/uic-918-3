const utils = require('./utils.js');
const enums = require('./enums.js');

// ################
// DATA TYPES
// ################

const STRING = (x) => x.toString();
const HEX = (x) => x.toString('hex');
const STR_INT = (x) => parseInt(x.toString(), 10);
const INT = (x) => x.readUIntBE(0, x.length);
const DB_DATETIME = (x) => {
  // DDMMYYYYHHMM
  const day = STR_INT(x.slice(0, 2)),
    month = STR_INT(x.slice(2, 4)) - 1,
    year = STR_INT(x.slice(4, 8)),
    hour = STR_INT(x.slice(8, 10)),
    minute = STR_INT(x.slice(10, 12));
  return new Date(year, month, day, hour, minute);
};
const KA_DATETIME = (x) => {
  //‘yyyyyyymmmmddddd’B + hhhhhmmmmmmsssss’B  (4 Byte)
  const date_str = utils.pad(parseInt(x.toString('hex'), 16).toString(2), 32);
  const year = parseInt(date_str.slice(0, 7), 2) + 1990,
    month = parseInt(date_str.slice(7, 11), 2) - 1,
    day = parseInt(date_str.slice(11, 16), 2),
    hour = parseInt(date_str.slice(16, 21), 2),
    minute = parseInt(date_str.slice(21, 27), 2),
    sec = parseInt(date_str.slice(27, 32), 2) / 2;
  return new Date(year, month, day, hour, minute, sec);
};

const ORG_ID = (x) => {
  const id = INT(x);
  return enums.org_id(id);
};

const EFM_PRODUKT = (x) => {
  const org_id = INT(x.slice(2, 4)),
    produkt_nr = INT(x.slice(0, 2));
  return enums.efm_produkt(org_id, produkt_nr);
}
const AUSWEIS_TYP = (x) => {
  const number = STR_INT(x);
  return enums.id_types.get(number).key;
};
const EFS_DATA = (x) => {
  const lengthList_DC = INT(x.slice(25, 26));
  var t = [];
  if (lengthList_DC + 26 < x.length) {
    t.push(x.slice(0, lengthList_DC + 26));
    t.push(x.slice(lengthList_DC + 26, x.length));
  }
  else {
    t.push(x.slice(0, lengthList_DC + 26));
  }
  const res = {};
  t.forEach((ticket, index) => {
    res[1 + index] = utils.interpretField(ticket, EFS_FIELDS);
  });
  return res;
};

function splitDCList(dc_length, typ_DC, org_id, data) {
  //0x0D 3 Byte CT, CM
  // 0x10 2 Byte Länder,SWT, QDL
  var SEP;
  if (parseInt(typ_DC, 16) === 0x10) {
    SEP = 2;
  }
  else {
    SEP = 3;
  }
  var amount = (dc_length - 3) / SEP;
  var res = [];
  for (var i = 0; i < amount; i++) {
    res.push(INT(data.slice(i * SEP, i * SEP + SEP)));
  }
  return res;
}

const DC_LISTE = (x) => {
  var res = {};
  res.dc_length = INT(x.slice(1, 2));
  res.typ_DC = HEX(x.slice(2, 3));
  res.pv_org_id = INT(x.slice(3, 5));
  const TP = splitDCList(res.dc_length, res.typ_DC, res.pv_org_id, x.slice(5, x.length));
  //FIXIT: ADD A PARSER
  res.TP = TP.map((item) => enums.tarifpunkt(res.pv_org_id, item));

  return res;
};

const EFS_FIELDS = [
  ['berechtigungs_nr', 4, INT],
  ['kvp_organisations_id', 2, ORG_ID],
  //['produkt_nr', 2, INT],
  ['efm_produkt', 4, EFM_PRODUKT],
  ['valid_from', 4, KA_DATETIME],
  ['valid_to', 4, KA_DATETIME],
  ['preis', 3, INT],
  ['sam_seqno', 4, INT],
  ['lengthList_DC', 1, INT],
  ['Liste_DC', null, DC_LISTE]
];

function interpretRCT2Block(data) {
  var res = {};
  res.line = parseInt(data.slice(0, 2).toString(), 10);
  res.column = parseInt(data.slice(2, 4).toString(), 10);
  res.height = parseInt(data.slice(4, 6).toString(), 10);
  res.width = parseInt(data.slice(6, 8).toString(), 10);
  res.style = parseInt(data.slice(8, 9).toString(), 10);
  const length = parseInt(data.slice(9, 13).toString(), 10);
  res.value = data.slice(13, 13 + length).toString();
  const rem = data.slice(13 + length);
  return [res, rem];
}

const RCT2_BLOCKS = (x) => {
  return utils.parseContainers(x, interpretRCT2Block);
};

const A_BLOCK_FIELDS_V2 = [
  ['certificate', 11, STRING],
  ['padding', 11, HEX],
  ['valid_from', 8, STRING],
  ['valid_to', 8, STRING],
  ['serial', 8, STRING]
];

const A_BLOCK_FIELDS_V3 = [
  ['valid_from', 8, STRING],
  ['valid_to', 8, STRING],
  ['serial', 10, STRING]
];

function interpretSingleSBlock(data) {
  var res = {};
  const type = enums.sBlockTypes.get(parseInt(data.slice(1, 4).toString(), 10));
  const length = parseInt(data.slice(4, 8).toString(), 10);
  res[type] = data.slice(8, 8 + length).toString();
  const rem = data.slice(8 + length);
  return [res, rem];
}

const auftraegeSblocks_V2 = (x) => {
  const A_LENGTH = 11 + 11 + 8 + 8 + 8;
  return auftraegeSblocks(x, A_LENGTH, A_BLOCK_FIELDS_V2);
};

const auftraegeSblocks_V3 = (x) => {
  const A_LENGTH = 10 + 8 + 8;
  return auftraegeSblocks(x, A_LENGTH, A_BLOCK_FIELDS_V3);
};

function auftraegeSblocks(x, A_LENGTH, fields) {
  var res = {};
  res.auftrag_count = parseInt(x.slice(0, 1).toString(), 10);
  for (var i = 0; i < res.auftrag_count; i++) {
    const bez = `auftrag_${i+1}`;
    res[bez] = utils.interpretField(x.slice(1 + (i * A_LENGTH), (i + 1) * A_LENGTH + 1), fields);
  }
  res.sblock_amount = parseInt(x.slice(A_LENGTH * res.auftrag_count + 1, A_LENGTH * res.auftrag_count + 3).toString(), 10);
  res.sblocks = utils.assignArrayToObj(utils.parseContainers(x.slice(A_LENGTH * res.auftrag_count + 3), interpretSingleSBlock));
  return res;
};

// ################
// DATA FIELDS
// ################

module.exports = [{
  name: 'U_HEAD',
  versions: {
    '01': [
      ['carrier', 4, STRING],
      ['auftragsnummer', 8, STRING],
      ['padding', 12, HEX],
      ['creation_date', 12, DB_DATETIME /*, datetime_parser()*/ ],
      ['flags', 1, STRING
        /*, lambda x: ",".join(
                               ['international'] if int(x) & 1 else [] +
                               ['edited'] if int(x) & 2 else [] +
                               ['specimen'] if int(x) & 4 else [])),*/
      ],
      ['language', 2, STRING],
      ['language_2', 2, STRING]
    ]
  }
}, {
  name: '0080VU',
  versions: {
    '01': [
      ['Terminalnummer:', 2, INT],
      ['SAM_ID', 3, INT],
      ['persons', 1, INT],
      ['anzahlEFS', 1, INT],
      ['VDV_EFS_BLOCK', null, EFS_DATA]
    ]
  }
}, {
  name: '1180AI',
  versions: {
    '01': [
      ['customer?', 7, STRING],
      ['vorgangs_num', 8, STRING],
      ['unknown1', 5, STRING],
      ['unknown2', 2, STRING],
      ['full_name', 20, STRING],
      ['adults#', 2, INT],
      ['children#', 2, INT],
      ['unknown3', 2, STRING],
      ['description', 20, STRING],
      ['ausweis?', 10, STRING],
      ['unknown4', 7, STRING],
      ['valid_from', 8, STRING],
      ['valid_to?', 8, STRING],
      ['unknown5', 5, STRING],
      ['start_bf', 20, STRING],
      ['unknown6', 5, STRING],
      ['ziel_bf?', 20, STRING],
      ['travel_class', 1, INT],
      ['unknown7', 6, STRING],
      ['unknown8', 1, STRING],
      ['issue_date', 8, STRING]
    ]
  }
}, {
  name: '0080BL',
  versions: {
    '02': [
      ['TBD0', 2, STRING],
      /* # '00' bei Schönem WE-Ticket / Ländertickets / Quer-Durchs-Land
      # '00' bei Vorläufiger BC
      # '02' bei Normalpreis Produktklasse C/B, aber auch Ausnahmen
      # '03' bei normalem IC/EC/ICE Ticket
      # '04' Hinfahrt A, Rückfahrt B; Rail&Fly ABC; Veranstaltungsticket; auch Ausnahmen
      # '05' bei Facebook-Ticket, BC+Sparpreis+neue BC25 [Ticket von 2011]
      # '18' bei Kauf via Android App */
      ['blocks', null, auftraegeSblocks_V2]
    ],
    '03': [
      ['TBD0', 2, STRING],
      ['blocks', null, auftraegeSblocks_V3]
    ]
  }
}, {
  name: '0080ID',
  versions: {
    '01': [
      ['ausweis_typ', 2, AUSWEIS_TYP],
      ['ziffer_ausweis', 4, STRING]
    ]
  }
}, {
  name: 'U_TLAY',
  versions: {
    '01': [
      ['layout', 4, STRING],
      ['amount_rct2_blocks', 4, STR_INT],
      ['rct2_blocks', null, RCT2_BLOCKS]
    ]
  }
}];
