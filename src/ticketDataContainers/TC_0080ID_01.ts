import { TicketContainerType } from '../TicketContainer.js';
import { AUSWEIS_TYP, STRING } from '../block-types.js';

const TC_0080ID_01: TicketContainerType = {
  name: '0080ID',
  version: '01',
  dataFields: [
    {
      name: 'ausweis_typ',
      length: 2,
      interpreterFn: AUSWEIS_TYP
    },
    {
      name: 'ziffer_ausweis',
      length: 4,
      interpreterFn: STRING
    }
  ]
};
export default TC_0080ID_01;
