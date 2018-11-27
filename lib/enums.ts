import {myConsoleLog} from './utils'
import {tarifpunkteData, orgIdData, efmProdukteData} from './ka-data'

export function orgId (orgId:number) : string {
  const res: string = orgIdData[orgId] ? orgIdData[orgId] : orgId.toString()
  return res
}

export function tarifpunkt (orgId:number, tp:number) : string {
  let res : string | undefined = undefined
  try {
    res = tarifpunkteData[orgId][tp]
  } catch (e) {
    myConsoleLog(e)
  }
  return res ? res : tp.toString()
}

interface EFMProdukt {
    produkt_nr: string | null,
    kvp_organisations_id: string
}

export function efm_produkt (org_id:number, produktId:number) : EFMProdukt  {
  const kvp_organisations_id : string = orgId(org_id)
  let produkt : string | undefined = undefined
  try {
     produkt = efmProdukteData[org_id][produktId] 
  } catch (e) {
    myConsoleLog(e)
  }
  const produkt_nr: string = produkt ? produkt : produktId.toString()
  return {produkt_nr: produkt_nr, kvp_organisations_id: kvp_organisations_id }
}

export enum SBlockTypes {
  Preismodell = 1,
  ProduktklasseGesamtticket = 2,
  ProduktklasseHinfahrt = 3,
  ProduktklasseRueckfahrt = 4,
  Passagiere = 9,
  Kinder = 12,
  Klasse = 14,
  HinfahrtStartBf = 15,
  HinfahrtZielBf = 16,
  RueckfahrtStartBf = 17,
  RueckfahrtZielBf = 18,
  Vorgangsnr = 19,
  Vertragspartner = 20,
  VIA = 21,
  Personenname = 23,
  Preisart = 26,
  AusweisID = 27,
  VornameName = 28,
  GueltigVon = 31,
  GueltigBis = 32,
  StartBfID = 35,
  ZielBfID = 36,
  AnzahlPersonen = 40,
  TBDEFSAnzahl =  41
}

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
