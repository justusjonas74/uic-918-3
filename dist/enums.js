"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const ka_data_1 = require("./ka-data");
function orgId(orgId) {
    const res = ka_data_1.orgIdData[orgId] ? ka_data_1.orgIdData[orgId] : orgId.toString();
    return res;
}
exports.orgId = orgId;
function tarifpunkt(orgId, tp) {
    let res = undefined;
    try {
        res = ka_data_1.tarifpunkteData[orgId][tp];
    }
    catch (e) {
        utils_1.myConsoleLog(e);
    }
    return res ? res : tp.toString();
}
exports.tarifpunkt = tarifpunkt;
function efm_produkt(org_id, produktId) {
    const kvp_organisations_id = orgId(org_id);
    let produkt = undefined;
    try {
        produkt = ka_data_1.efmProdukteData[org_id][produktId];
    }
    catch (e) {
        utils_1.myConsoleLog(e);
    }
    const produkt_nr = produkt ? produkt : produktId.toString();
    return { produkt_nr: produkt_nr, kvp_organisations_id: kvp_organisations_id };
}
exports.efm_produkt = efm_produkt;
var SBlockTypes;
(function (SBlockTypes) {
    SBlockTypes[SBlockTypes["Preismodell"] = 1] = "Preismodell";
    SBlockTypes[SBlockTypes["ProduktklasseGesamtticket"] = 2] = "ProduktklasseGesamtticket";
    SBlockTypes[SBlockTypes["ProduktklasseHinfahrt"] = 3] = "ProduktklasseHinfahrt";
    SBlockTypes[SBlockTypes["ProduktklasseRueckfahrt"] = 4] = "ProduktklasseRueckfahrt";
    SBlockTypes[SBlockTypes["Passagiere"] = 9] = "Passagiere";
    SBlockTypes[SBlockTypes["Kinder"] = 12] = "Kinder";
    SBlockTypes[SBlockTypes["Klasse"] = 14] = "Klasse";
    SBlockTypes[SBlockTypes["HinfahrtStartBf"] = 15] = "HinfahrtStartBf";
    SBlockTypes[SBlockTypes["HinfahrtZielBf"] = 16] = "HinfahrtZielBf";
    SBlockTypes[SBlockTypes["RueckfahrtStartBf"] = 17] = "RueckfahrtStartBf";
    SBlockTypes[SBlockTypes["RueckfahrtZielBf"] = 18] = "RueckfahrtZielBf";
    SBlockTypes[SBlockTypes["Vorgangsnr"] = 19] = "Vorgangsnr";
    SBlockTypes[SBlockTypes["Vertragspartner"] = 20] = "Vertragspartner";
    SBlockTypes[SBlockTypes["VIA"] = 21] = "VIA";
    SBlockTypes[SBlockTypes["Personenname"] = 23] = "Personenname";
    SBlockTypes[SBlockTypes["Preisart"] = 26] = "Preisart";
    SBlockTypes[SBlockTypes["AusweisID"] = 27] = "AusweisID";
    SBlockTypes[SBlockTypes["VornameName"] = 28] = "VornameName";
    SBlockTypes[SBlockTypes["GueltigVon"] = 31] = "GueltigVon";
    SBlockTypes[SBlockTypes["GueltigBis"] = 32] = "GueltigBis";
    SBlockTypes[SBlockTypes["StartBfID"] = 35] = "StartBfID";
    SBlockTypes[SBlockTypes["ZielBfID"] = 36] = "ZielBfID";
    SBlockTypes[SBlockTypes["AnzahlPersonen"] = 40] = "AnzahlPersonen";
    SBlockTypes[SBlockTypes["TBDEFSAnzahl"] = 41] = "TBDEFSAnzahl";
})(SBlockTypes = exports.SBlockTypes || (exports.SBlockTypes = {}));
// exports.TBD0 = new Enum({
//   /* # '00' bei Schönem WE-Ticket / Ländertickets / Quer-Durchs-Land
//   # '00' bei Vorläufiger BC
//   # '02' bei Normalpreis Produktklasse C/B, aber auch Ausnahmen
//   # '03' bei normalem IC/EC/ICE Ticket
//   # '04' Hinfahrt A, Rückfahrt B; Rail&Fly ABC; Veranstaltungsticket; auch Ausnahmen
//   # '05' bei Facebook-Ticket, BC+Sparpreis+neue BC25 [Ticket von 2011]
//   # '18' bei Kauf via Android App */
// })
var IDTypes;
(function (IDTypes) {
    IDTypes[IDTypes["CC"] = 1] = "CC";
    IDTypes[IDTypes["BC"] = 4] = "BC";
    IDTypes[IDTypes["EC"] = 7] = "EC";
    IDTypes[IDTypes["BCbusiness"] = 8] = "BCbusiness";
    IDTypes[IDTypes["Personalausweis"] = 9] = "Personalausweis";
    IDTypes[IDTypes["Reisepass"] = 10] = "Reisepass";
    IDTypes[IDTypes["bahnBonusCard"] = 11] = "bahnBonusCard";
})(IDTypes = exports.IDTypes || (exports.IDTypes = {}));
