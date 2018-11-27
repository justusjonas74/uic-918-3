

// PRODUCTS 
export class Produkt {
  name:string
  id: number 
  constructor (nummer:number, nameText: string) {
    this.name = nameText
    this.id = nummer
  }
}

interface ProduktListe {
  [index: number]: Produkt
}

// ORGANISATION 
function isDuplicateFree (liste1 : ProduktListe, liste2: ProduktListe): boolean {
  const keys1 = Object.keys(liste1)
  const keys2 = Object.keys(liste2)
  let intersection = keys1.filter(x => keys2.includes(x));
  return intersection.length === 0
}
export class Organisation {
  readonly name: string
  readonly id: number
  products: ProduktListe
  
  constructor (orgId:number, orgName: string) {
    this.name = orgName
    this.id = orgId
    this.products = {}
  }
  
  addProducts(produktListe : ProduktListe) : void {
    if (!this.products) {
      this.products = produktListe
    } else if (isDuplicateFree(this.products, produktListe))  {
      // CHECK IF PRODUCT IS ALLREADY INCLUDED
      
      
      this.products = Object.assign(this.products, produktListe)
    }
  }
}

interface OrganisationenListe {
  [index: number]: Organisation
}

export class OrganisationenPool {
  private organisationen: OrganisationenListe
  constructor (organisationenListe: OrganisationenListe) {
    this.organisationen = organisationenListe
  }
  
  getByID (id:number) : Organisation | null {
    const organisation = this.organisationen[id] 
    return organisation ? organisation : null 
  }
  
  getNameByID(id:number) : string {
    const organisation = this.getByID(id)
    return organisation ? organisation.name : id.toString()
  }
}

