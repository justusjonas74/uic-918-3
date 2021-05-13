import { DBDateTime } from "../simpleTypes/DBDateTime";
import { PrintableString } from "../simpleTypes/PrintableString";
import { RCT2ContainerType } from "./UIC_RCT2Block";

export const UICDataContainer : RCT2ContainerType[] = [{
    name: 'U_HEAD',
    version: 1,
    handlers: [
        ['carrier', 4, PrintableString],
        ['auftragsnummer', 8, PrintableString],
        ['padding', 12],
        ['creation_date', 12, DBDateTime], /*, datetime_parser() */
        ['flags', 1, PrintableString],
        ['language', 2, PrintableString],
        ['language_2', 2, PrintableString]
      ]
    }
]
//   , {
//     name: '0080VU',
//     version: {
//       '01': [
//         ['Terminalnummer:', 2, INT],
//         ['SAM_ID', 3, INT],
//         ['persons', 1, INT],
//         ['anzahlEFS', 1, INT],
//         ['VDV_EFS_BLOCK', null, EFS_DATA]
//       ]
//     }
//   }, {
//     name: '1180AI',
//     versions: {
//       '01': [
//         ['customer?', 7, STRING],
//         ['vorgangs_num', 8, STRING],
//         ['unknown1', 5, STRING],
//         ['unknown2', 2, STRING],
//         ['full_name', 20, STRING],
//         ['adults#', 2, INT],
//         ['children#', 2, INT],
//         ['unknown3', 2, STRING],
//         ['description', 20, STRING],
//         ['ausweis?', 10, STRING],
//         ['unknown4', 7, STRING],
//         ['valid_from', 8, STRING],
//         ['valid_to?', 8, STRING],
//         ['unknown5', 5, STRING],
//         ['start_bf', 20, STRING],
//         ['unknown6', 5, STRING],
//         ['ziel_bf?', 20, STRING],
//         ['travel_class', 1, INT],
//         ['unknown7', 6, STRING],
//         ['unknown8', 1, STRING],
//         ['issue_date', 8, STRING]
//       ]
//     }
//   }, {
//     name: '0080BL',
//     versions: {
//       '02': [
//         ['TBD0', 2, STRING],
//         /* # '00' bei Schönem WE-Ticket / Ländertickets / Quer-Durchs-Land
//         # '00' bei Vorläufiger BC
//         # '02' bei Normalpreis Produktklasse C/B, aber auch Ausnahmen
//         # '03' bei normalem IC/EC/ICE Ticket
//         # '04' Hinfahrt A, Rückfahrt B; Rail&Fly ABC; Veranstaltungsticket; auch Ausnahmen
//         # '05' bei Facebook-Ticket, BC+Sparpreis+neue BC25 [Ticket von 2011]
//         # '18' bei Kauf via Android App */
//         ['blocks', null, auftraegeSBlocksV2]
//       ],
//       '03': [
//         ['TBD0', 2, STRING],
//         ['blocks', null, auftraegeSBlocksV3]
//       ]
//     }
//   }, {
//     name: '0080ID',  // NO SOURCE FOUND FOR THIS BLOCK.
//     versions: {
//       '01': [
//         ['ausweis_typ', 2, AUSWEIS_TYP],
//         ['ziffer_ausweis', 4, STRING]
//       ],
//       '02': [
//         ['ausweis_typ', 2, AUSWEIS_TYP],
//         ['ziffer_ausweis', 4, STRING]
//       ]
//     }
//   }, {
//     name: 'U_TLAY',
//     versions: {
//       '01': [
//         ['layout', 4, STRING],
//         ['amount_rct2_blocks', 4, STR_INT],
//         ['rct2_blocks', null, RCT2_BLOCKS]
//       ]
//     }
//   }]