import { TicketContainerType } from '../TicketContainer';
import { STRING, auftraegeSBlocksV3 } from '../block-types';

const TC_0080BL_03: TicketContainerType = {
  name: '0080BL',
  version: '03',
  dataFields: [
    {
      name: 'TBD0',
      length: 2,
      interpreterFn: STRING
    },
    {
      name: 'blocks',
      length: null,
      interpreterFn: auftraegeSBlocksV3
    }
  ]
};
export default TC_0080BL_03;
