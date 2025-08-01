import { TicketContainerType } from '../TicketContainer.js';
import { INT, STRING } from '../block-types.js';
const TC_1180AI_01: TicketContainerType = {
  name: '1180AI',
  version: '01',
  dataFields: [
    {
      name: 'customer?',
      length: 7,
      interpreterFn: STRING
    },
    {
      name: 'vorgangs_num',
      length: 8,
      interpreterFn: STRING
    },
    {
      name: 'unknown1',
      length: 5,
      interpreterFn: STRING
    },
    {
      name: 'unknown2',
      length: 2,
      interpreterFn: STRING
    },
    {
      name: 'full_name',
      length: 20,
      interpreterFn: STRING
    },
    {
      name: 'adults#',
      length: 2,
      interpreterFn: INT
    },
    {
      name: 'children#',
      length: 2,
      interpreterFn: INT
    },
    {
      name: 'unknown3',
      length: 2,
      interpreterFn: STRING
    },
    {
      name: 'description',
      length: 20,
      interpreterFn: STRING
    },
    {
      name: 'ausweis?',
      length: 10,
      interpreterFn: STRING
    },
    {
      name: 'unknown4',
      length: 7,
      interpreterFn: STRING
    },
    {
      name: 'valid_from',
      length: 8,
      interpreterFn: STRING
    },
    {
      name: 'valid_to?',
      length: 8,
      interpreterFn: STRING
    },
    {
      name: 'unknown5',
      length: 5,
      interpreterFn: STRING
    },
    {
      name: 'start_bf',
      length: 20,
      interpreterFn: STRING
    },
    {
      name: 'unknown6',
      length: 5,
      interpreterFn: STRING
    },
    {
      name: 'ziel_bf?',
      length: 20,
      interpreterFn: STRING
    },
    {
      name: 'travel_class',
      length: 1,
      interpreterFn: INT
    },
    {
      name: 'unknown7',
      length: 6,
      interpreterFn: STRING
    },
    {
      name: 'unknown8',
      length: 1,
      interpreterFn: STRING
    },
    {
      name: 'issue_date',
      length: 8,
      interpreterFn: STRING
    }
  ]
};

export default TC_1180AI_01;
