import { id_types, sBlockTypes, orgid, efm_produkt, tarifpunkt, EFM_Produkt } from './enums';

import { FieldsType, InterpreterFunctionType } from './FieldsType';
import {
  interpretField,
  interpretFieldResult as InterpretFieldResult,
  pad,
  parseContainers,
  parsingFunction
} from './utils';

// ################
// DATA TYPES
// ################

export const STRING: InterpreterFunctionType<string> = (x: Buffer) => x.toString();
export const HEX: InterpreterFunctionType<string> = (x: Buffer) => x.toString('hex');
export const STR_INT: InterpreterFunctionType<number> = (x: Buffer) => parseInt(x.toString(), 10);
export const INT: InterpreterFunctionType<number> = (x: Buffer) => x.readUIntBE(0, x.length);
export const DB_DATETIME: InterpreterFunctionType<Date> = (x: Buffer) => {
  // DDMMYYYYHHMM
  const day = STR_INT(x.subarray(0, 2));
  const month = STR_INT(x.subarray(2, 4)) - 1;
  const year = STR_INT(x.subarray(4, 8));
  const hour = STR_INT(x.subarray(8, 10));
  const minute = STR_INT(x.subarray(10, 12));
  return new Date(year, month, day, hour, minute);
};
const KA_DATETIME: InterpreterFunctionType<Date> = (x: Buffer) => {
  // ‘yyyyyyymmmmddddd’B + hhhhhmmmmmmsssss’B  (4 Byte)
  const dateStr = pad(parseInt(x.toString('hex'), 16).toString(2), 32);
  const year = parseInt(dateStr.slice(0, 7), 2) + 1990;
  const month = parseInt(dateStr.slice(7, 11), 2) - 1;
  const day = parseInt(dateStr.slice(11, 16), 2);
  const hour = parseInt(dateStr.slice(16, 21), 2);
  const minute = parseInt(dateStr.slice(21, 27), 2);
  const sec = parseInt(dateStr.slice(27, 32), 2) / 2;
  return new Date(year, month, day, hour, minute, sec);
};

const ORG_ID = (x: Buffer): string => {
  const id = INT(x);
  return orgid(id);
};

const EFM_PRODUKT = (x: Buffer): EFM_Produkt => {
  const orgId = INT(x.subarray(2, 4));
  const produktNr = INT(x.subarray(0, 2));
  return efm_produkt(orgId, produktNr);
};
export const AUSWEIS_TYP = (x: Buffer): string => {
  const number = STR_INT(x);
  return id_types[number];
};

export interface DC_LISTE_TYPE {
  tagName: string;
  dc_length: number;
  typ_DC: string;
  pv_org_id: number;
  TP: string[];
}

const DC_LISTE = (x: Buffer): DC_LISTE_TYPE => {
  const tagName = HEX(x.subarray(0, 1));
  const dc_length = INT(x.subarray(1, 2));
  const typ_DC = HEX(x.subarray(2, 3));
  const pv_org_id = INT(x.subarray(3, 5));
  const TP_RAW = splitDCList(dc_length, typ_DC, x.subarray(5, x.length));
  const TP = TP_RAW.map((item) => tarifpunkt(pv_org_id, item));
  return { tagName, dc_length, typ_DC, pv_org_id, TP };
};

const EFS_FIELDS: FieldsType[] = [
  {
    name: 'berechtigungs_nr',
    length: 4,
    interpreterFn: INT
  },
  {
    name: 'kvp_organisations_id',
    length: 2,
    interpreterFn: ORG_ID
  },
  {
    name: 'efm_produkt',
    length: 4,
    interpreterFn: EFM_PRODUKT
  },
  {
    name: 'valid_from',
    length: 4,
    interpreterFn: KA_DATETIME
  },
  {
    name: 'valid_to',
    length: 4,
    interpreterFn: KA_DATETIME
  },
  {
    name: 'preis',
    length: 3,
    interpreterFn: INT
  },
  {
    name: 'sam_seqno',
    length: 4,
    interpreterFn: INT
  },
  {
    name: 'lengthList_DC',
    length: 1,
    interpreterFn: INT
  },
  {
    name: 'Liste_DC',
    length: undefined,
    interpreterFn: DC_LISTE
  }
];

export type IEFS_DATA = Record<number, InterpretFieldResult>;
export const EFS_DATA = (x: Buffer): IEFS_DATA => {
  const lengthListDC = INT(x.subarray(25, 26));

  const t = [x.subarray(0, lengthListDC + 26)];

  if (lengthListDC + 26 < x.length) {
    t.push(x.subarray(lengthListDC + 26, x.length));
  }
  const res: IEFS_DATA = {};
  t.forEach((ticket, index) => {
    res[1 + index] = interpretField(ticket, EFS_FIELDS);
  });
  return res;
};

function splitDCList(dcLength: number, typDC: string, data: Buffer): number[] {
  // 0x0D 3 Byte CT, CM
  // 0x10 2 Byte Länder,SWT, QDL
  let SEP: number;
  if (parseInt(typDC, 16) === 0x10) {
    SEP = 2;
  } else {
    SEP = 3;
  }
  const amount = (dcLength - 3) / SEP;
  const res = [];
  for (let i = 0; i < amount; i++) {
    res.push(INT(data.subarray(i * SEP, i * SEP + SEP)));
  }
  return res;
}

export type RCT2_BLOCK = {
  line: number;
  column: number;
  height: number;
  width: number;
  style: number;
  value: string;
};

const interpretRCT2Block: parsingFunction = (data: Buffer): [RCT2_BLOCK, Buffer] => {
  const line = parseInt(data.subarray(0, 2).toString(), 10);
  const column = parseInt(data.subarray(2, 4).toString(), 10);
  const height = parseInt(data.subarray(4, 6).toString(), 10);
  const width = parseInt(data.subarray(6, 8).toString(), 10);
  const style = parseInt(data.subarray(8, 9).toString(), 10);
  const length = parseInt(data.subarray(9, 13).toString(), 10);
  const value = data.subarray(13, 13 + length).toString();
  const res: RCT2_BLOCK = {
    line,
    column,
    height,
    width,
    style,
    value
  };
  const rem = data.subarray(13 + length);
  return [res, rem];
};

export const RCT2_BLOCKS = (x: Buffer): RCT2_BLOCK[] => {
  return parseContainers(x, interpretRCT2Block) as RCT2_BLOCK[];
};

const A_BLOCK_FIELDS_V2: FieldsType[] = [
  {
    name: 'certificate',
    length: 11,
    interpreterFn: STRING
  },
  {
    name: 'padding',
    length: 11,
    interpreterFn: HEX
  },
  {
    name: 'valid_from',
    length: 8,
    interpreterFn: STRING
  },
  {
    name: 'valid_to',
    length: 8,
    interpreterFn: STRING
  },
  {
    name: 'serial',
    length: 8,
    interpreterFn: STRING
  }
];

const A_BLOCK_FIELDS_V3: FieldsType[] = [
  {
    name: 'valid_from',
    length: 8,
    interpreterFn: STRING
  },
  {
    name: 'valid_to',
    length: 8,
    interpreterFn: STRING
  },
  {
    name: 'serial',
    length: 10,
    interpreterFn: STRING
  }
];

const interpretSingleSBlock: parsingFunction = (data: Buffer): [Record<string, string>, Buffer] => {
  const res: Record<string, string> = {};
  const type = sBlockTypes[parseInt(data.subarray(1, 4).toString(), 10)];
  const length = parseInt(data.subarray(4, 8).toString(), 10);
  res[type] = data.subarray(8, 8 + length).toString();
  const rem = data.subarray(8 + length);
  return [res, rem];
};

export const auftraegeSBlocksV2 = (x: Buffer): InterpretFieldResult => {
  const A_LENGTH = 11 + 11 + 8 + 8 + 8;
  return auftraegeSblocks(x, A_LENGTH, A_BLOCK_FIELDS_V2);
};

export const auftraegeSBlocksV3 = (x: Buffer): InterpretFieldResult => {
  const A_LENGTH = 10 + 8 + 8;
  return auftraegeSblocks(x, A_LENGTH, A_BLOCK_FIELDS_V3);
};

function auftraegeSblocks(x: Buffer, A_LENGTH: number, fields: FieldsType[]): InterpretFieldResult {
  const res: InterpretFieldResult = {};
  res.auftrag_count = parseInt(x.subarray(0, 1).toString(), 10);
  for (let i = 0; i < res.auftrag_count; i++) {
    const bez = `auftrag_${i + 1}`;
    res[bez] = interpretField(x.subarray(1 + i * A_LENGTH, (i + 1) * A_LENGTH + 1), fields);
  }
  res.sblock_amount = parseInt(
    x.subarray(A_LENGTH * res.auftrag_count + 1, A_LENGTH * res.auftrag_count + 3).toString(),
    10
  );
  const sblock_containers = parseContainers(x.subarray(A_LENGTH * res.auftrag_count + 3), interpretSingleSBlock);
  res.sblocks = Object.assign({}, ...sblock_containers);
  return res;
}
