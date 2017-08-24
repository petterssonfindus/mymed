/**
 * Datenmodell zum Element einer Suchtreffer-Liste
 * Enthält die ID und nur das, was als Treffer angezeigt wird
 */

export class Suchtreffer {

    private idmedikament: number;
    private pzn: string;
    private name: string;
    private kategorie: number;

    constructor(
        idmedikament?: number,
        pzn?: string,
        name?: string,
        kategorie?: number,
    ) {
        this.idmedikament = idmedikament;
        this.pzn = pzn;
        this.name = name;
        this.kategorie = kategorie;
    }

    setidmedikament(idmedikament: number): void { this.idmedikament = idmedikament }
    setpzn(pzn: string): void { this.pzn = pzn }
    setname(id: string): void { this.name = name }
    setkategorie(kategorie: number): void { this.kategorie = kategorie }

    getidmedikament(): number { return this.idmedikament }
    getpzn(): string { return this.pzn }
    getname(): string { return this.name }
    getkategorie(): number { return this.kategorie }

}