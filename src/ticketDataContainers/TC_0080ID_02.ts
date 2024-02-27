import { TicketContainerType } from '../TicketContainer';
import { AUSWEIS_TYP, STRING } from '../block-types';

const TC_0080ID_02: TicketContainerType = {
  name: '0080ID',
  version: '02',
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
export default TC_0080ID_02;
