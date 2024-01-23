import { TicketContainerType } from "../TicketContainer";
import { RCT2_BLOCKS, STRING, STR_INT } from "../block-types";

const TC_U_TLAY_01 : TicketContainerType = {
    name: 'U_TLAY',
    version: '01',
    dataFields: [
      {
        name: 'layout',
        length: 4,
        interpreterFn: STRING
      },
      {
        name: 'amount_rct2_blocks',
        length: 4,
        interpreterFn: STR_INT
      },
      {
        name: 'rct2_blocks',
        length: null,
        interpreterFn: RCT2_BLOCKS
      },
    ]
  }

  export default TC_U_TLAY_01