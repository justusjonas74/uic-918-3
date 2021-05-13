// exports.TBD0 = new Enum({
//   /* # '00' bei Schönem WE-Ticket / Ländertickets / Quer-Durchs-Land
//   # '00' bei Vorläufiger BC
//   # '02' bei Normalpreis Produktklasse C/B, aber auch Ausnahmen
//   # '03' bei normalem IC/EC/ICE Ticket
//   # '04' Hinfahrt A, Rückfahrt B; Rail&Fly ABC; Veranstaltungsticket; auch Ausnahmen
//   # '05' bei Facebook-Ticket, BC+Sparpreis+neue BC25 [Ticket von 2011]
//   # '18' bei Kauf via Android App */
// })

export enum IDTypes {
  CC = 1,
  BC = 4,
  EC = 7,
  BCbusiness = 8,
  Personalausweis = 9,
  Reisepass = 10,
  bahnBonusCard = 11
}
