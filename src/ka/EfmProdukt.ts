import { Organisation } from "./Organisation"
import { Produkt } from "./Produkt"

export class EfmProdukt { 
    static produktPool: ProduktPool = [
        { 
            organisation: new Organisation(6262), // DB FERN
            produkte: [
                new Produkt(2000, 'City-Ticket')
            ]
        },{
            organisation: new Organisation(6263), // DB Regio
            produkte: [
                new Produkt( 1000, 'City-mobil Einzelfahrt'),
                new Produkt( 1001, 'City-mobil Tageskarte'),
                new Produkt( 1002, 'Baden-Württemberg-Ticket'),
                new Produkt( 1004, 'Baden-Württemberg-Ticket Nacht'),
                new Produkt( 1005, 'Bayern-Ticket'),
                new Produkt( 1007, 'Bayern-Ticket-Nacht'),
                new Produkt( 1008, 'Brandenburg-Berlin-Ticket'),
                new Produkt( 1009, 'Brandenburg-Berlin-Ticket-Nacht'),
                new Produkt( 1010, 'Mecklenburg-Vorpommern-Ticket'),
                new Produkt( 1011, 'Niedersachsen-Ticket'),
                new Produkt( 1012, 'Rheinland-Pfalz-Ticket'),
                new Produkt( 1013, 'Rheinland-Pfalz-Ticket-Nacht'),
                new Produkt( 1014, 'Saarland-Ticket'),
                new Produkt( 1015, 'Saarland-Ticket-Nacht'),
                new Produkt( 1016, 'Sachsen-Anhalt-Ticket'),
                new Produkt( 1017, 'Sachsen-Ticket'),
                new Produkt( 1018, 'Schleswig-Holstein-Ticket'),
                new Produkt( 1019, 'Thüringen-Ticket'),
                new Produkt( 1200, 'Schönes-Wochenende-Ticket'),
                new Produkt( 1201, 'Quer-Durchs-Land-Ticket'),
                new Produkt( 1020, 'Rheinland-Pfalz-Ticket + Luxemburg')
            ]
        }
        
    ]

    private static  getProductsByOrgansiation (organisation:Organisation) : Produkt[] {
        let produkte : Produkt[] = []
        const filteredPoolByOrganisation =  EfmProdukt.produktPool.find(poolItem => {
              return poolItem.organisation.id == organisation.id
            })
        if (filteredPoolByOrganisation) {
            produkte = produkte.concat(filteredPoolByOrganisation.produkte)
        }
        return produkte
      }

    public static getProduct (orgId: number, produktnummer: number ) : EfmProdukt {
        const organisation = new Organisation(orgId) 
        const kwnonProductOfOrganisation = EfmProdukt.getProductsByOrgansiation(organisation)
        let produkt: Produkt
        if (kwnonProductOfOrganisation.length > 0){
            produkt = kwnonProductOfOrganisation.find(produkteItem => {
                return produkteItem.produktNummer == produktnummer
            })
        } 
        if (!produkt) {
          produkt = new Produkt(produktnummer)
        }           
        return new EfmProdukt(organisation, produkt)
    }

    constructor(
      public organisation: Organisation,
      public produkt: Produkt
    ) {} 

    get name():string {
      return this.produkt.produktname
    }
}



type ProduktPool = {
        organisation: Organisation,
        produkte: Produkt[]
}[]