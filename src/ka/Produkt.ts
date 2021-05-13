
export class Produkt {
  constructor(
    public produktNummer: number,
    private _produktname?: string
  ) { }

  get produktname():string {
    return this._produktname ? this._produktname : `??? (${this.produktNummer.toString()})`;
  }

  set produktname(value: string) {
    this._produktname = value;
  }
}
