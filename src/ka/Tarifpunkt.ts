import { Organisation } from "./Organisation"

export class Tarifpunkt {
    
    private static ortePool = () : Tarifpunkt[] => {
        const tarifpunkte : Tarifpunkt[] = []
        // DB Orte
        const dbFernOrg = new Organisation(6262)
        const dbRegioOrg = new Organisation(6263)
        const dbOrte : Ort [] = [   // 6262, 6263      
            {nr: 8000001, name: 'Aachen Hbf'},
            {nr: 8000002, name: 'Aalen'},
            {nr: 8000441, name: 'Ahlen(Westf)'},
            {nr: 8000605, name: 'Arnsberg(Westf)'},
            {nr: 8000010, name: 'Aschaffenburg Hbf'},
            {nr: 8000013, name: 'Augsburg Hbf'},
            {nr: 8000712, name: 'Bad Homburg'},
            {nr: 8000774, name: 'Baden-Baden'},
            {nr: 8000025, name: 'Bamberg'},
            {nr: 8000028, name: 'Bayreuth Hbf'},
            {nr: 8000899, name: 'Bergisch-Gladbach'},
            {nr: 8011155, name: 'Berlin Alexanderpl'},
            {nr: 8010038, name: 'Berlin Friedrichstr'},
            {nr: 8011102, name: 'Berlin Gesundbrunnen'},
            {nr: 8011160, name: 'Berlin Hbf'},
            {nr: 8010255, name: 'Berlin Ostbahnhof'},
            {nr: 8011118, name: 'Berlin Potsdamer Pl'},
            {nr: 8011113, name: 'Berlin Südkreuz'},
            {nr: 8010405, name: 'Berlin Wannsee'},
            {nr: 8010406, name: 'Berlin Zoolg. Garten'},
            {nr: 8010403, name: 'Berlin-Charlottenbg)'},
            {nr: 8010036, name: 'Berlin-Lichtenberg'},
            {nr: 8010404, name: 'Berlin-Spandau'},
            {nr: 8000036, name: 'Bielefeld Hbf'},
            {nr: 8000040, name: 'Bocholt'},
            {nr: 8000041, name: 'Bochum Hbf'},
            {nr: 8001038, name: 'Bochum-Dahlhausen'},
            {nr: 8000044, name: 'Bonn Hbf'},
            {nr: 8001083, name: 'Bonn-Beuel'},
            {nr: 8000047, name: 'Bottrop Hbf'},
            {nr: 8000049, name: 'Braunschweig Hbf'},
            {nr: 8000050, name: 'Bremen Hbf'},
            {nr: 8000051, name: 'Bremerhaven Hbf'},
            {nr: 8000054, name: 'Brilon Wald'},
            {nr: 8000059, name: 'Bünde(Westf)'},
            {nr: 8000064, name: 'Celle'},
            {nr: 8010184, name: 'Chemnitz Hbf'},
            {nr: 8010073, name: 'Cottbus'},
            {nr: 8000067, name: 'Crailsheim'},
            {nr: 8000068, name: 'Darmstadt Hbf'},
            {nr: 8000070, name: 'Delmenhorst'},
            {nr: 8001420, name: 'Detmold'},
            {nr: 8000080, name: 'Dortmund Hbf'},
            {nr: 8010085, name: 'Dresden Hbf'},
            {nr: 8000084, name: 'Düren'},
            {nr: 8000223, name: 'Düren-Annakirmespl'},
            {nr: 8000085, name: 'Düsseldorf Hbf'},
            {nr: 8000086, name: 'Duisburg Hbf'},
            {nr: 8001611, name: 'Duisburg-Ruhrort'},
            {nr: 8010101, name: 'Erfurt Hbf'},
            {nr: 8001844, name: 'Erlangen'},
            {nr: 8000098, name: 'Essen Hbf'},
            {nr: 8001900, name: 'Essen-Altenessen'},
            {nr: 8001920, name: 'Esslingen(Neckar)'},
            {nr: 8001972, name: 'Feldhausen'},
            {nr: 8000103, name: 'Flensburg Hbf'},
            {nr: 8000105, name: 'Frankfurt(Main)Hbf'},
            {nr: 8002041, name: 'Frankfurt(Main)Süd'},
            {nr: 8010113, name: 'Frankfurt(Oder)'},
            {nr: 8000107, name: 'Freiburg(Brsg)Hbf'},
            {nr: 8000112, name: 'Friedrichshafen St)'},
            {nr: 8000114, name: 'Fürth(Bay)Hbf'},
            {nr: 8000115, name: 'Fulda'},
            {nr: 8000118, name: 'Gelsenkirchen Hbf'},
            {nr: 8002224, name: 'Gelsenkirchen-Buer N'},
            {nr: 8002225, name: 'Gelsenkirchen-Buer S'},
            {nr: 8010125, name: 'Gera Hbf'},
            {nr: 8000124, name: 'Gießen'},
            {nr: 8000128, name: 'Göttingen'},
            {nr: 8010139, name: 'Greifswald'},
            {nr: 8002461, name: 'Gütersloh Hbf'},
            {nr: 8000142, name: 'Hagen Hbf'},
            {nr: 8010159, name: 'Halle(Saale)Hbf'},
            {nr: 8002548, name: 'Hamburg Dammtor'},
            {nr: 8000147, name: 'Hamburg-Harburg'},
            {nr: 8002549, name: 'Hamburg Hbf'},
            {nr: 8000146, name: 'Hamburg-Sternschanze'},
            {nr: 8000148, name: 'Hameln'},
            {nr: 8000149, name: 'Hamm (Westf)'},
            {nr: 8000150, name: 'Hanau Hbf'},
            {nr: 8000152, name: 'Hannover Hbf'},
            {nr: 8003487, name: 'HannoverMesseLaatzen'},
            {nr: 8000156, name: 'Heidelberg Hbf'},
            {nr: 8000157, name: 'Heilbronn Hbf'},
            {nr: 8000162, name: 'Herford'},
            {nr: 8000164, name: 'Herne'},
            {nr: 8000169, name: 'Hildesheim Hbf'},
            {nr: 8003036, name: 'Ibbenbüren'},
            {nr: 8000183, name: 'Ingolstadt Hbf'},
            {nr: 8000186, name: 'Iserlohn'},
            {nr: 8011956, name: 'Jena Paradies'},
            {nr: 8011058, name: 'Jena Saalbf'},
            {nr: 8011957, name: 'Jena West'},
            {nr: 8000189, name: 'Kaiserslautern Hbf'},
            {nr: 8000191, name: 'Karlsruhe Hbf'},
            {nr: 8000193, name: 'Kassel Hbf'},
            {nr: 8003200, name: 'Kassel-Wilhelmshöhe'},
            {nr: 8000199, name: 'Kiel Hbf'},
            {nr: 8000206, name: 'Koblenz Hbf'},
            {nr: 8000207, name: 'Köln Hbf'},
            {nr: 8003400, name: 'Konstanz'},
            {nr: 8000211, name: 'Krefeld Hbf'},
            {nr: 8010205, name: 'Leipzig Hbf'},
            {nr: 8006713, name: 'Leverkusen Mitte'},
            {nr: 8000571, name: 'Lippstadt'},
            {nr: 8000235, name: 'Ludwigsburg'},
            {nr: 8000236, name: 'Ludwigshafen(Rh)Hbf'},
            {nr: 8003729, name: 'Lörrach Hbf'},
            {nr: 8003782, name: 'Lüdenscheid'},
            {nr: 8000237, name: 'Lübeck Hbf'},
            {nr: 8000238, name: 'Lüneburg'},
            {nr: 8000239, name: 'Lünen Hbf'},
            {nr: 8010224, name: 'Magdeburg Hbf'},
            {nr: 8000240, name: 'Mainz Hbf'},
            {nr: 8000244, name: 'Mannheim Hbf'},
            {nr: 8000337, name: 'Marburg(Lahn)'},
            {nr: 8000252, name: 'Minden(Westf)'},
            {nr: 8000644, name: 'Moers'},
            {nr: 8000253, name: 'Mönchengladbach Hbf'},
            {nr: 8000259, name: 'Mülheim(Ruhr)Hbf'},
            {nr: 8000261, name: 'München Hbf'},
            {nr: 8000263, name: 'Münster(Westf)Hbf'},
            {nr: 8000271, name: 'Neumünster'},
            {nr: 8000274, name: 'Neuss Hbf'},
            {nr: 8000275, name: 'Neustadt(Weinstr)Hbf'},
            {nr: 8000284, name: 'Nürnberg Hbf'},
            {nr: 8000286, name: 'Oberhausen Hbf'},
            {nr: 8000349, name: 'Offenbach(Main)Hbf'},
            {nr: 8000290, name: 'Offenburg'},
            {nr: 8000291, name: 'Oldenburg(Oldb)'},
            {nr: 8000853, name: 'Opladen'},
            {nr: 8000294, name: 'Osnabrück Hbf'},
            {nr: 8000297, name: 'Paderborn Hbf'},
            {nr: 8000298, name: 'Passau Hbf'},
            {nr: 8000299, name: 'Pforzheim'},
            {nr: 8010275, name: 'Plauen(Vogtl) ob Bf'},
            {nr: 8012666, name: 'Potsdam Hbf'},
            {nr: 8004965, name: 'Ravensburg'},
            {nr: 8000307, name: 'Recklinghausen Hbf'},
            {nr: 8000309, name: 'Regensburg'},
            {nr: 8005033, name: 'Remscheid Hbf'},
            {nr: 8000314, name: 'Reutlingen Hbf'},
            {nr: 8000316, name: 'Rheine'},
            {nr: 8010304, name: 'Rostock Hbf'},
            {nr: 8000323, name: 'Saarbrücken Hbf'},
            {nr: 8005265, name: 'Salzgitter-Bad'},
            {nr: 8005269, name: 'Salzgitter-Immendorf'},
            {nr: 8005270, name: 'Salzgitter-Lebenstdt'},
            {nr: 8000325, name: 'Salzgitter-Ringelh)'},
            {nr: 8005274, name: 'Salzgitter-Thiede'},
            {nr: 8005275, name: 'Salzgitter-Watenst)'},
            {nr: 8005449, name: 'Schwäbisch Hall'},
            {nr: 8010324, name: 'Schwerin Hbf'},
            {nr: 8000046, name: 'Siegen'},
            {nr: 8000076, name: 'Soest'},
            {nr: 8000087, name: 'Solingen Hbf'},
            {nr: 8005628, name: 'Speyer Hbf'},
            {nr: 8000096, name: 'Stuttgart Hbf'},
            {nr: 8000134, name: 'Trier Hbf'},
            {nr: 8000141, name: 'Tübingen Hbf'},
            {nr: 8000170, name: 'Ulm Hbf'},
            {nr: 8000171, name: 'Unna'},
            {nr: 8000192, name: 'Wanne-Eickel Hbf'},
            {nr: 8010366, name: 'Weimar'},
            {nr: 8000250, name: 'Wiesbaden Hbf'},
            {nr: 8006445, name: 'Wilhelmshaven HBF'},
            {nr: 8000251, name: 'Witten Hbf'},
            {nr: 8006552, name: 'Wolfsburg Hbf'},
            {nr: 8000257, name: 'Worms Hbf'},
            {nr: 8000260, name: 'Würzburg Hbf'},
            {nr: 8000266, name: 'Wuppertal Hbf'},
            {nr: 8010397, name: 'Zwickau(Sachs)Hbf'}
        ]    
        const allDBOrte = () => {
            return dbOrte.reduce((returnValue : Tarifpunkt[],currentOrt) => {
                const dbOrteTwice : Tarifpunkt[]= [dbFernOrg, dbRegioOrg].map(org=>{return new Tarifpunkt(currentOrt.nr, org, currentOrt.name)})  
                returnValue.push(...dbOrteTwice)
                return returnValue
            }, [])
        }
    
        // KA Orte 
        const vdvKaOrg = new Organisation(5000)
        const vdvKaOrte : Ort[] = [    // 5000
            { nr: 1, name: 'Bundesrepublik gesamt'},
            { nr: 2, name: 'Baden-Württemberg'},
            { nr: 3, name: 'Bayern'},
            { nr: 4, name: 'Berlin'},
            { nr: 5, name: 'Brandenburg'},
            { nr: 6, name: 'Bremen'},
            { nr: 7, name: 'Hamburg'},
            { nr: 8, name: 'Hessen'},
            { nr: 9, name: 'Mecklenburg-Vorpommern'},
            { nr: 10, name: 'Niedersachsen'},
            { nr: 11, name: 'Nordrhein-Westfalen'},
            { nr: 12, name: 'Rheinland-Pfalz'},
            { nr: 13, name: 'Saarland'},
            { nr: 14, name: 'Sachsen'},
            { nr: 15, name: 'Sachsen-Anhalt'},
            { nr: 16, name: 'Schleswig-Holstein'},
            { nr: 17, name: 'Thüringen'}
        ]
        const allVdvKaOrte = vdvKaOrte.map(ort=>{
            return new Tarifpunkt(ort.nr, vdvKaOrg, ort.name)
        })
    
        // Returning Value
        tarifpunkte.push(...allVdvKaOrte)
        tarifpunkte.push(...allDBOrte())
        return tarifpunkte
    } 

    private static pool : Tarifpunkt[] = Tarifpunkt.ortePool()

    public static getByIdAndOrg(tarifpunktNummer: number, organisation: Organisation) : Tarifpunkt {
        const tp = this.pool.find(tarifpunkt => {
            return (tarifpunkt.tarifpunktNummmer == tarifpunktNummer && tarifpunkt.organisation.id == organisation.id)
        })

        if (tp) {
            return tp
        } else {
            return new Tarifpunkt(tarifpunktNummer, organisation)
        }
    }
    constructor(
        public tarifpunktNummmer: number,
        public organisation: Organisation,
        private _tarifpunktName?: string,
    ){}

    get tarifpunktName():string {
        return this._tarifpunktName ? this._tarifpunktName : this.tarifpunktNummmer.toString() 
    }

    set tarifpunktName(value:string) {
        this._tarifpunktName = value
    }
}


/// Helper

interface Ort {
    nr: number, 
    name: string
}




