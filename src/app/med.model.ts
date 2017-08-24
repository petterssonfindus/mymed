/**
 * Datenmodell zu einem Medikament mit Bestands-Informationen 
 */
import { MedKlein } from "./medklein.model";

export class Med extends MedKlein {
    private medid: number;
    private wirkungsweise: string;
    private anwendungsgebiet: string;
    private wirkstoffe: string;
    private gegenanzeigen: string;
    private dosierung: string;
    private pfadbild: string;
    private pfadbeipackzettel: string;
    private fehlercode: number;

    /**
     * wird  genutzt beim Anzeigen einer Med-Page
     * istAbgelaufen wird intern berechnet - nicht von außen gesetzt
     */
    constructor(
    ) {
        super();
    }

    setmedid(medid: number) { this.medid = medid }
    setwirkungsweise(wirkungsweise: string) { this.wirkungsweise = wirkungsweise }
    setanwendungsgebiet(anwendungsgebiet: string) { this.anwendungsgebiet = anwendungsgebiet }
    setwirkstoffe(wirkstoffe: string) { this.wirkstoffe = wirkstoffe }
    setdosierung(dosierung: string) { this.dosierung = dosierung }
    setgegenanzeigen(gegenanzeigen: string) { this.gegenanzeigen = gegenanzeigen }
    setpfadbild(pfadbild: string) { this.pfadbild = pfadbild }
    setpfadbeipackzettel(pfadbeipackzettel: string) { this.pfadbeipackzettel = pfadbeipackzettel }
    setfehlercode(fehlercode: number) { this.fehlercode = fehlercode }

    getmedid() :number {return this.medid}
    getwirkungsweise(): string {return this.wirkungsweise}
    getanwendungsgebiet(): string {return this.anwendungsgebiet}
    getwirkstoffe(): string {return this.wirkstoffe}
    getgegenanzeigen(): string {return this.gegenanzeigen}
    getdosierung(): string {return this.dosierung}
    getpfadbild(): string {return this.pfadbild}
    getpfadbeipackzettel(): string {return this.pfadbeipackzettel}
    getfehlercode(): number {return this.fehlercode}

}