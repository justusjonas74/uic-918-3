import { TicketContainerType } from "../TicketContainer";
import { DB_DATETIME, HEX, STRING } from "../block-types";

const TC_U_HEAD_01 : TicketContainerType =  {
    name: 'U_HEAD',
    version: '01',
    dataFields: [
        {
            name: 'carrier',
            length: 4,
            interpreterFn: STRING
        },
        {
            name: 'auftragsnummer',
            length: 8,
            interpreterFn: STRING
        },
        {
            name: 'padding',
            length: 12,
            interpreterFn: HEX
        },
        {
            name: 'creation_date',
            length: 12,
            interpreterFn: DB_DATETIME
        },
        {
            name: 'flags',
            length: 1,
            interpreterFn: STRING
        },
        {
            name: 'language',
            length: 2,
            interpreterFn: STRING
        },
        {
            name: 'language_2',
            length: 2,
            interpreterFn: STRING
        }
    ]
}
export default TC_U_HEAD_01
