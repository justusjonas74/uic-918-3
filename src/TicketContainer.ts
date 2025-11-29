import { FieldsType } from './FieldsType.js';

import TC_U_HEAD_01 from './ticketDataContainers/TC_U_HEAD_01.js';
import TC_0080VU_01 from './ticketDataContainers/TC_0080VU_01.js';
import TC_1180AI_01 from './ticketDataContainers/TC_1180AI_01.js';
import TC_0080BL_02 from './ticketDataContainers/TC_0080BL_02.js';
import TC_0080BL_03 from './ticketDataContainers/TC_0080BL_03.js';
import TC_0080ID_01 from './ticketDataContainers/TC_0080ID_01.js';
import TC_0080ID_02 from './ticketDataContainers/TC_0080ID_02.js';
import TC_U_TLAY_01 from './ticketDataContainers/TC_U_TLAY_01.js';
import TC_U_FLEX_03 from './ticketDataContainers/TC_U_FLEX_03.js';

type TicketContainerTypeVersions = '01' | '02' | '03';

export interface TicketContainerType {
  name: string;
  version: TicketContainerTypeVersions;
  dataFields: FieldsType[];
}

export const TicketContainer: TicketContainerType[] = [
  TC_U_HEAD_01,
  TC_0080VU_01,
  TC_1180AI_01,
  TC_0080BL_02,
  TC_0080BL_03,
  TC_0080ID_01,
  TC_0080ID_02,
  TC_U_TLAY_01,
  TC_U_FLEX_03
];

export default TicketContainer;
