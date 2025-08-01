import KA_DATA from './ka-data.js';

export const orgid = (orgId: number): string => {
  return KA_DATA.org_id[orgId] || orgId.toString();
};

export const tarifpunkt = (orgId: number, tp: number): string => {
  if (KA_DATA.tarifpunkte[orgId] && KA_DATA.tarifpunkte[orgId][tp]) {
    return KA_DATA.tarifpunkte[orgId][tp];
  } else {
    return tp.toString();
  }
};

export type EFM_Produkt = {
  kvp_organisations_id: string;
  produkt_nr: string;
};

export const efm_produkt = (orgId: number, produktId: number): EFM_Produkt => {
  const kvp_organisations_id = orgid(orgId);
  const produkt_nr =
    KA_DATA.efmprodukte[orgId] && KA_DATA.efmprodukte[orgId][produktId]
      ? KA_DATA.efmprodukte[orgId][produktId]
      : produktId.toString();
  return { kvp_organisations_id, produkt_nr };
};

export enum sBlockTypes {
  'Preismodell' = 1,
  'Produktklasse Gesamtticket' = 2,
  'Produktklasse Hinfahrt' = 3,
  'Produktklasse Rückfahrt' = 4,
  'Passagiere' = 9,
  'Kinder' = 12,
  'Klasse' = 14,
  'H-Start-Bf' = 15,
  'H-Ziel-Bf' = 16,
  'R-Start-Bf' = 17,
  'R-Ziel-Bf' = 18,
  'Vorgangsnr./Flugscheinnr.' = 19,
  'Vertragspartner' = 20,
  'VIA' = 21,
  'Personenname' = 23,
  'Preisart' = 26,
  'Ausweis-ID' = 27,
  'Vorname, Name' = 28,
  'Gueltig von' = 31,
  'Gueltig bis' = 32,
  'Start-Bf-ID' = 35,
  'Ziel-Bf-ID' = 36,
  'Anzahl Personen' = 40,
  'TBD EFS Anzahl' = 41
}

export enum id_types {
  'CC' = 1,
  'BC' = 4,
  'EC' = 7,
  'Bonus.card business' = 8,
  'Personalausweis' = 9,
  'Reisepass' = 10,
  'bahn.bonus Card' = 11
}
