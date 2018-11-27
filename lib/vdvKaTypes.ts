

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
    } else {
      // CHECK IF PRODUCT IS ALLREADY INCLUDED
      const keys1 = Object.keys(this.products)
      const keys2 = Object.keys(produktListe)
      console.log(keys1)
      console.log(keys2)
      
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

