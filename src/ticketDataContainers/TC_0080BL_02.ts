import { TicketContainerType } from '../TicketContainer';
import { STRING, auftraegeSBlocksV2 } from '../block-types';

const TC_0080BL_02: TicketContainerType = {
  name: '0080BL',
  version: '02',
  dataFields: [
    {
      name: 'TBD0',
      length: 2,
      interpreterFn: STRING
    },
    {
      name: 'blocks',
      length: undefined,
      interpreterFn: auftraegeSBlocksV2
    }
    /* # '00' bei Schönem WE-Ticket / Ländertickets / Quer-Durchs-Land
      # '00' bei Vorläufiger BC
      # '02' bei Normalpreis Produktklasse C/B, aber auch Ausnahmen
      # '03' bei normalem IC/EC/ICE Ticket
      # '04' Hinfahrt A, Rückfahrt B; Rail&Fly ABC; Veranstaltungsticket; auch Ausnahmen
      # '05' bei Facebook-Ticket, BC+Sparpreis+neue BC25 [Ticket von 2011]
      # '18' bei Kauf via Android App */
  ]
};

export default TC_0080BL_02;
