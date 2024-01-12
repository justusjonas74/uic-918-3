const utils = require('./utils.js')

const KA_DATA = require('./ka-data')

const orgid = (orgId:number) => {
  const res = KA_DATA.org_id[orgId]
  if (res) {
    return res
  } else {
    return orgId.toString()
  }
}
exports.org_id = orgid

exports.tarifpunkt = (orgId:number, tp:number) => {
  let res
  try {
    res = KA_DATA.tarifpunkte[orgId][tp]
  } catch (error) {
    utils.myConsoleLog(e)
    res = null
  }
  if (res) {
    return res
  } else {
    return tp.toString()
  }
}

exports.efm_produkt = (orgId, produktId) => {
  const res = {}
  res.kvp_organisations_id = orgid(orgId)
  let prod
  try {
    prod = KA_DATA.efmprodukte[orgId][produktId]
  } catch (e) {
    utils.myConsoleLog(e)
    prod = null
  } finally {
    if (prod) {
      res.produkt_nr = prod
    } else {
      res.produkt_nr = produktId.toString()
    }
  }
  return res
}

exports.sBlockTypes = new Enum({
  Preismodell: 1,
  'Produktklasse Gesamtticket': 2,
  'Produktklasse Hinfahrt': 3,
  'Produktklasse Rückfahrt': 4,
  Passagiere: 9,
  Kinder: 12,
  Klasse: 14,
  'H-Start-Bf': 15,
  'H-Ziel-Bf': 16,
  'R-Start-Bf': 17,
  'R-Ziel-Bf': 18,
  'Vorgangsnr./Flugscheinnr.': 19,
  Vertragspartner: 20,
  VIA: 21,
  Personenname: 23,
  Preisart: 26,
  'Ausweis-ID': 27,
  'Vorname, Name': 28,
  'Gueltig von': 31,
  'Gueltig bis': 32,
  'Start-Bf-ID': 35,
  'Ziel-Bf-ID': 36,
  'Anzahl Personen': 40,
  'TBD EFS Anzahl': 41
})

exports.TBD0 = new Enum({
  /* # '00' bei Schönem WE-Ticket / Ländertickets / Quer-Durchs-Land
  # '00' bei Vorläufiger BC
  # '02' bei Normalpreis Produktklasse C/B, aber auch Ausnahmen
  # '03' bei normalem IC/EC/ICE Ticket
  # '04' Hinfahrt A, Rückfahrt B; Rail&Fly ABC; Veranstaltungsticket; auch Ausnahmen
  # '05' bei Facebook-Ticket, BC+Sparpreis+neue BC25 [Ticket von 2011]
  # '18' bei Kauf via Android App */
})

exports.id_types = new Enum({
  CC: 1,
  BC: 4,
  EC: 7,
  'Bonus.card business': 8,
  Personalausweis: 9,
  Reisepass: 10,
  'bahn.bonus Card': 11
})
