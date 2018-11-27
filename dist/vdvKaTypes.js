"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// PRODUCTS 
class Produkt {
    constructor(nummer, nameText) {
        this.name = nameText;
        this.id = nummer;
    }
}
exports.Produkt = Produkt;
// ORGANISATION 
function isDuplicateFree(liste1, liste2) {
    const keys1 = Object.keys(liste1);
    const keys2 = Object.keys(liste2);
    let intersection = keys1.filter(x => keys2.includes(x));
    return intersection.length === 0;
}
class Organisation {
    constructor(orgId, orgName) {
        this.name = orgName;
        this.id = orgId;
        this.products = {};
    }
    addProducts(produktListe) {
        if (!this.products) {
            this.products = produktListe;
        }
        else if (isDuplicateFree(this.products, produktListe)) {
            // CHECK IF PRODUCT IS ALLREADY INCLUDED
            this.products = Object.assign(this.products, produktListe);
        }
    }
}
exports.Organisation = Organisation;
class OrganisationenPool {
    constructor(organisationenListe) {
        this.organisationen = organisationenListe;
    }
    getByID(id) {
        const organisation = this.organisationen[id];
        return organisation ? organisation : null;
    }
    getNameByID(id) {
        const organisation = this.getByID(id);
        return organisation ? organisation.name : id.toString();
    }
}
exports.OrganisationenPool = OrganisationenPool;
