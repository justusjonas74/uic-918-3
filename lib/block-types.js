const utils = require('./utils.js');
const enums = require('./enums.js');

// ################
// DATA TYPES
// ################

const STRING = (x) => x.toString();
const HEX = (x) => x.toString('hex');
const STR_INT = (x) => parseInt(x.toString());
const INT = (x) => x.readUIntBE(0, x.length);
const DB_DATETIME = (x) => {
  // DDMMYYYYHHMM
  const day = hexstringToInt(x.slice(0,2)),
        month = hexstringToInt(x.slice(2,4)) - 1,
        year = hexstringToInt(x.slice(4,8)),
        hour = hexstringToInt(x.slice(8,10)),
        minute = hexstringToInt(x.slice(10,12));
  return new Date(year, month, day, hour, minute);
};

const EFS_DATA = (x) => {
  const lengthList_DC = INT(x.slice(25,26));
  var t = [];
  if (lengthList_DC + 26 < x.length) {
    t.push(x.slice(0, lengthList_DC + 26));
    t.push(x.slice(lengthList_DC + 26, x.length));
  } else {
    t.push(x.slice(0, lengthList_DC + 26));
  }
  const res = {};
  t.forEach( (ticket, index) => {
    res[1 + index] = utils.interpretField(ticket, EFS_FIELDS);
  });
  return res;
};

const DateTimeCompact = (x) => {

};

function splitDCList (dc_length, typ_DC, org_id,  data) {
  //0x0D 3 Byte CT, CM
  // 0x10 2 Byte Länder,SWT, QDL
  var SEP;
  if (typ_DC === 0x10) {
    SEP = 2;
  } else {
    SEP = 3;
  }
  var amount = (dc_length - 3) / SEP;
  var res = [];
  for(var i=0; i < amount; i++){
    res.push(INT(data.slice(i*SEP, i*SEP + SEP)));
  }
  return res;
}

const DC_LISTE = (x) => {
  var res = {};
  res.dc_length = INT(x.slice(1,2));
  res.typ_DC = INT(x.slice(2,3));
  res.pv_org_id = INT(x.slice(3,5));
  res.TP = splitDCList(res.dc_length, res.typ_DC, res.pv_org_id,   x.slice(5, x.length));
  return res;
};

const EFS_FIELDS = [
  ['berechtigungs_nr', 4, INT],
  ['kvp_organisations_id', 2, INT],
  ['produkt_nr', 2, INT],
  ['pv_organisations_id', 2, INT],
  ['valid_from', 4, DateTimeCompact],
  ['valid_to', 4, DateTimeCompact],
  ['preis', 3, INT],
  ['sam_seqno', 4, INT],
  ['lengthList_DC', 1, INT],
  ['Liste_DC', null, DC_LISTE]
];

function interpretRCT2Block (data) {
  var res = {};
  res.line = parseInt(data.slice(0,2).toString());
  res.column = parseInt(data.slice(2,4).toString());
  res.height = parseInt(data.slice(4,6).toString());
  res.width = parseInt(data.slice(6,8).toString());
  res.style = parseInt(data.slice(8,9).toString());
  const length = parseInt(data.slice(9,13).toString());
  res.value = data.slice(13, 13 + length).toString();
  const rem = data.slice(13 + length);
  return [res, rem];
}

const RCT2_BLOCKS = (x) => {
  return utils.parseContainers(x, interpretRCT2Block);
};

const A_BLOCK_FIELDS_V2 = [
  ['certificate', 11, STRING],
  ['padding', 11],
  ['valid_from', 8, HEX],
  ['valid_to', 8, HEX],
  ['serial', 8, STRING]
];

const A_BLOCK_FIELDS_V3 = [
  ['valid_from', 8, STRING],
  ['valid_to', 8, STRING],
  ['serial', 10, STRING]
];

function interpretSingleSBlock (data) {
  //FORMAT: Saaabbbbd[...]d
  //FORMAT: Saaabbbbdd
  var res = {};
  const type = enums.sBlockTypes.get(parseInt(data.slice(1,4).toString()));
  //const type = parseInt(data.slice(1,4).toString());
  // TODO: type is enum, so better interpret here
  const length = parseInt(data.slice(4,8).toString());
  res[type] = data.slice(8, 8 + length).toString();
  const rem = data.slice(8 + length);
  return [res, rem];
}

const auftraegeSblocks_V2 = (x) => {
  var res = {};
  const A_LENGTH = 11 + 11 + 8 + 8 + 8;
  res.auftrag_count = parseInt(x.slice(0,1).toString());
  for(var i = 0; i < res.auftrag_count; i++){
      const bez = `auftrag_${i+1}`;
      res[bez] = utils.interpretField(x.slice(1 + (i*A_LENGTH), (i+1) * A_LENGTH + 1), A_BLOCK_FIELDS_V2);
  }
  res.sblock_amount = parseInt(x.slice(A_LENGTH * res.auftrag_count + 1, A_LENGTH * res.auftrag_count + 3).toString());
  res.sblocks = utils.parseContainers(x.slice(A_LENGTH * res.auftrag_count + 3), interpretSingleSBlock);
  return res;
};

const auftraegeSblocks_V3 = (x) => {
  var res = {};
  const A_LENGTH = 10 + 8 + 8;
  res.auftrag_count = parseInt(x.slice(0,1).toString());
  for(var i = 0; i < res.auftrag_count; i++){
      const bez = `auftrag_${i+1}`;
      res[bez] = utils.interpretField(x.slice(1 + (i*A_LENGTH), (i+1) * A_LENGTH + 1), A_BLOCK_FIELDS_V3);
  }
  res.sblock_amount = parseInt(x.slice(A_LENGTH * res.auftrag_count + 1, A_LENGTH * res.auftrag_count + 3).toString());
  res.sblocks = utils.parseContainers(x.slice(A_LENGTH * res.auftrag_count + 3), interpretSingleSBlock);
  return res;
};

// ################
// HELPER
// ################
function hexstringToInt(hex) {
  return  parseInt(hex.toString());
}

// ################
// DATA FIELDS
// ################
// Mostly taken from https://github.com/rumpeltux/onlineticket

module.exports =
[
  {
    name: 'U_HEAD',
    versions: {
      '01': [
        ['carrier', 4, STRING],
        ['auftragsnummer', 8, STRING],
        ['padding', 12,HEX],
        ['creation_date', 12, DB_DATETIME /*, datetime_parser()*/],
        ['flags', 1 ,STRING /*, lambda x: ",".join(
                        ['international'] if int(x) & 1 else [] +
                        ['edited'] if int(x) & 2 else [] +
                        ['specimen'] if int(x) & 4 else [])),*/ ],
        ['language', 2,STRING],
        ['language_2', 2,STRING]
      ]
    }
  },{
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
  },{
    name: '1180AI',
    versions:{
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
  },{
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
  },{
    name: '0080ID',
    versions: {
      '01': [
        ['ausweis_typ', 2, INT ],
                    /*{ TODO:
                    '01': 'CC', '04': 'BC', '07': 'EC',
                    '08': 'Bonus.card business',
                    '09': 'Personalausweis',
                    '10': 'Reisepass',
                    '11': 'bahn.bonus Card'}*/
        ['ziffer_ausweis', 4, STRING]
      ]
    }
  },{
    name: 'U_TLAY',
    versions: {
      '01': [
        ['layout', 4, STRING],
        ['amount_rct2_blocks', 4, STR_INT],
        ['rct2_blocks', null, RCT2_BLOCKS]
      ]
    }
  }
];
