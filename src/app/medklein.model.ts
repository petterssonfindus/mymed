/**
 * Datenmodell zum Element der Bestands-Liste
 * Enthält die ID und nur das, was auf dem Listenelement angezeigt wird
 */

export class MedKlein {

    private idbestand: number;    // die eindeutige ID des Bestands-Elements
    private idmedikament: number;    // die eindeutige ID des zugehörigen Medikaments
    private istAbgelaufen: boolean; // ist abgeleitet, kann nicht gesetzt werden 
    private pzn: string;
    private name: string;
    private kategorie: number;
    private ablaufdatum: Date;
    private bestand: number;
    private apothekenpflichtig: number;
    private entsorgung: number;

    constructor(
        idbestand?: number,
        idmedikament?: number,
        pzn?: string,
        name?: string,
        kategorie?: number,
        ablaufdatum?: Date,
        bestand?: number,
        apothekenpflichtig?: number,
        entsorgung?: number
    ) {
        this.idbestand = idbestand;
        this.idmedikament = idmedikament;
        this.pzn = pzn;
        this.name = name;
        this.kategorie = kategorie;
        this.ablaufdatum = ablaufdatum;
        this.bestand = bestand;
        this.apothekenpflichtig = apothekenpflichtig;
        this.entsorgung = entsorgung;
        this.istAbgelaufen = this.checkIstAbgelaufen();
    }

    setidbestand(idbestand: number): void { this.idbestand = idbestand }
    setidmedikament(idmedikament: number): void { this.idmedikament = idmedikament }
    setpzn(pzn: string): void { this.pzn = pzn }
    setname(name: string): void { this.name = name }
    setkategorie(kategorie: number): void { this.kategorie = kategorie }
    setablaufdatum(ablaufdatum: Date): void {
        this.ablaufdatum = ablaufdatum;
        this.checkIstAbgelaufen();
    }
    setablaufdatumnumber(ablaufnumber: number) {
        this.ablaufdatum = new Date(ablaufnumber);
    }
    setbestand(bestand: number): void { this.bestand = bestand }
    setentsorgung(entsorgung: number): void { this.entsorgung = entsorgung }
    setapothekenpflichtig(apothekenpflichtig: number): void { this.apothekenpflichtig = apothekenpflichtig }

    getidbestand(): number { return this.idbestand }
    getidmedikament(): number { return this.idmedikament }
    getpzn(): string { return this.pzn }
    getname(): string { return this.name }
    getkategorie(): number { return this.kategorie }
    getablaufdatum(): Date { return this.ablaufdatum }
    getbestand(): number { return this.bestand }
    getentsorgung(): number { return this.entsorgung }
    getapothekenpflichtig(): number { return this.apothekenpflichtig }
    getistabgelaufen(): boolean { return this.checkIstAbgelaufen() }

    // Vorsicht Konsistenz mit 'istAbgelaufen'
    checkIstAbgelaufen(): boolean {
        let heute = new Date();
        if (this.ablaufdatum == undefined) {
            return false;
        } else {
            return heute.valueOf() > this.ablaufdatum.valueOf();
        }

    }

}