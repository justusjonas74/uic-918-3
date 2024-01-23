import { TicketContainerType } from "../TicketContainer";
import {INT, EFS_DATA } from "../block-types";

const TC_0080VU_01 : TicketContainerType = 
{
  name: '0080VU',
  version: '01',
  dataFields: [
    {
      name: 'Terminalnummer',
      length: 2,
      interpreterFn: INT
    },
    {
      name: 'SAM_ID',
      length: 3,
      interpreterFn: INT
    },
    {
      name: 'persons',
      length: 1,
      interpreterFn: INT
    },
    {
      name: 'anzahlEFS',
      length: 1,
      interpreterFn: INT
    },
    {
      name: 'VDV_EFS_BLOCK',
      length: null,
      interpreterFn: EFS_DATA
    },
  ]
}

export default TC_0080VU_01