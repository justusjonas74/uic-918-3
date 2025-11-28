import { TicketContainerType } from '../TicketContainer.js';
import { parseUFLEX } from '../uflex.js';
// import { RCT2_BLOCKS, STRING, STR_INT } from '../block-types.js';

const TC_U_FLEX_03: TicketContainerType = {
  name: 'U_TLAY',
  version: '01',
  dataFields: [
    {
      name: 'FCB_Container',
      length: null,
      interpreterFn: (x: Buffer) => parseUFLEX(x.toString('hex'))
    }
  ]
};

export default TC_U_FLEX_03;
