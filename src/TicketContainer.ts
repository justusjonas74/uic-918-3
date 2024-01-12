import { FieldsType } from "./FieldsType";

import TC_U_HEAD from "./ticketDataContainers/TC_U_HEAD";
import TC_0080VU from "./ticketDataContainers/TC_0080VU";
import TC_1180AI from "./ticketDataContainers/TC_1180AI";
import TC_0080BL_02 from "./ticketDataContainers/TC_0080BL_02";
import TC_0080BL_03 from "./ticketDataContainers/TC_0080BL_03";
import TC_0080ID_01 from "./ticketDataContainers/TC_0080ID_01";
import TC_0080ID_02 from "./ticketDataContainers/TC_0080ID_02";
import U_TLAY_01 from "./ticketDataContainers/TC_U_TLAY";


type TicketContainerTypeVersions = '01' | '02' | '03'

export interface TicketContainerType {
  name: string,
  version: TicketContainerTypeVersions
  dataFields: FieldsType[]
}

export const TicketContainer: TicketContainerType[] = [
  TC_U_HEAD, 
  TC_0080VU,
  TC_1180AI, 
  TC_0080BL_02,
  TC_0080BL_03,
  TC_0080ID_01,
  TC_0080ID_02,
  U_TLAY_01
 ];

export default TicketContainer