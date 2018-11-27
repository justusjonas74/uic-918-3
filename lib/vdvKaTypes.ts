export class Organisation {
  readonly name: string
  readonly id: number
  
  constructor (orgId:number, orgName: string) {
    this.name = orgName
    this.id = orgId
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