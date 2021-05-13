export class Organisation {

  private static defaults: {
    id: number;
    name: string;
  }[] = [
      { id: 5000, name: 'VDV E-Ticket Service' },
      { id: 6262, name: 'DB Fernverkehr' },
      { id: 6263, name: 'DB Regio Zentrale' },
      { id: 6260, name: 'DB Vertrieb GmbH' },
    ];

  id: number;
  private _name?: string;

  constructor(id: number, name?: string) {
    this.id = id;
    this._name = name ? name : this.defaultName(id);
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  private defaultName(id: number): string {
    const knownOrganisation = Organisation.defaults.find(org => org.id == id);
    const name = knownOrganisation ? knownOrganisation.name : id.toString();
    return name;
  }

}
