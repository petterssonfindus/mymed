import { Http, Headers, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { Injectable, OnInit } from "@angular/core";
import { Med } from './med.model';
import { MedNeu } from './medneu.model';
import { MedKlein } from './medklein.model';
import { MedList } from './medlist.model';

import 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Filter } from "./filter.model";
import { User } from "./user.model";
import { Suchtreffer } from "./suchtreffer";

@Injectable()
export class MedService implements OnInit {

    private medKlein: MedKlein;
    private med: Med;
    //    private medList: [MedKlein] = new MedList().getMedList();
    //    private medList = new Subject<Med>();
    // medList$ = this.medList.asObservable();

    test: any;
    filter: Filter;
    medList: MedKlein[];
    suchtrefferList: Array<Suchtreffer>;
    medKlein1: MedKlein = new MedKlein(
        39,
        1,
        "1234567",
        'Initial-Medikament aus Med-Service',
        1,
        new Date(),
        16,
        1
    );
    medKlein2: MedKlein = new MedKlein(
        40,
        3,
        "2345678",
        '2. Initial-Medikament aus Med-Service',
        1,
        new Date(new Date().setFullYear(2020, 11, 30)),
        7,
        1
    );
    medKlein3: MedKlein = new MedKlein(
        41,
        4,
        "3456789",
        '3. Initial-Medikament aus Med-Service',
        2,
        new Date(new Date().setFullYear(2016, 11, 30)),
        1,
        0
    );

    constructor(private http: Http) {
        this.medList = [this.medKlein1, this.medKlein2, this.medKlein3];
        //        this.medList = this.getMedListFromServer().subscribe();
        this.medKlein2.getablaufdatum().setMonth(11);
        this.medKlein3.getablaufdatum().setFullYear(2016, 11, 30);

        this.med = new Med();
        this.suchtrefferList = new Array<Suchtreffer>();

        this.filter = new Filter();
        this.filter.durchfall = true;
        this.filter.erkaeltung = true;
        this.filter.schmerz = true;
    }

    ngOnInit() {

    }

    getMed(): Med {
        return this.med;
    }

    getMedList(): MedKlein[] {
        return this.medList;
    }

    getSuchtrefferListe(): Suchtreffer[] {
        return this.suchtrefferList;
    }

    clearSuchtrefferListe() {
        this.suchtrefferList = new Array<Suchtreffer>();
        console.log("medService: clearSuchtrefferliste ", this.suchtrefferList);
    }

    getFilter(): Filter {
        return this.filter;
    }

    getMedListAsStrings(): string[] {
        var medStrings: string[] = new Array<string>();
        this.medList.forEach(element => {
            medStrings.push(element.getname())
        });
        return medStrings;
    }

    // wird nicht verwendet - nur zur Demo
    getTestMed(pzn: string) {
        return this.http.get('https://hero-app-fe5d8.firebaseio.com/user.json').
            map((response: Response) => {
                const data = response.json();
                console.log("data: ", data);
                const returnArray = [];
                for (let key in data) {
                    returnArray.push(data[key])
                }
                return returnArray;
            }
            )
    }

    // zu Test-Zwecken
    getMedTest(pzn: string): Med {
        this.med = new Med();
        this.med.setidbestand(1);
        this.med.setanwendungsgebiet("Testmed: wirkt sofort und immer bei allen Arten von Krankheiten");
        this.med.setapothekenpflichtig(2);
        this.med.setdosierung("nicht zu viel und nicht zu wenig");
        this.med.setgegenanzeigen("keine Gegeanzeigen");
        this.med.setpfadbild("/assets/img12345.gif");
        this.med.setwirkstoffe("Acetysalicylsäure");
        this.med.setkategorie(1);
        this.med.setbestand(32);

        return this.med;
    }

    sendData(user: any): Observable<Response> {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/jscon' });
        return this.http.post('https://hero-app-fe5d8.firebaseio.com/daten.json', body, { headers: headers });
    }

    /*  holt den Gesamt-Bestand vom Server
        und führt eine Aktualisierung der Liste durch 
    */
    getMedListFromServer2(): Promise<any> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('function', '1');
        params.set('userid', '2');
        let options = new RequestOptions();
        options.search = params;
        return this.http.get('http://localhost:8080/info', options)
            .toPromise()
            .then((response: Response) => {
                const jsonData = response.json();
                let derbestand: Array<any> = jsonData['trefferliste'];
                console.log("derBestand: ", derbestand);
                let returnArray = [];
                this.medList.splice(0, this.medList.length);
                derbestand.map((element: any) => {
                    let newMedKlein = new MedKlein(
                        element["idbestand"],
                        element["idmedikament"],
                        element["pzn"],
                        element["name"],
                        element["kategorie"],
                        element["ablaufdatum"],
                        element["bestand"],
                        element["apothekenpflichtig"]
                    );
                    this.medList.push(newMedKlein);
                    console.log("element", element);
                    console.log("newElement: ", newMedKlein);

                })
            })
    }

    /*  sucht nach Medikamenten
        und aktualisiert die Trefferliste 
    */
    searchMedFromServer(suchtext: string): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('function', '4');
        params.set('userid', '2');
        params.set('pzn', suchtext);
        let options = new RequestOptions();
        options.search = params;
        return this.http.get('http://localhost:8080/info', options)
            .map((response: Response) => {
                const jsonData = response.json();
                console.log("SearchMedFormServer: jsonData: ", jsonData);
                let trefferliste: Array<any> = jsonData['bestand'];
                if (trefferliste != undefined) {

                    console.log("Trefferliste: ", trefferliste);
                    let returnArray = [];
                    if (this.suchtrefferList != undefined) {
                        this.suchtrefferList.splice(0, this.suchtrefferList.length);
                    }
                    else {
                        this.suchtrefferList = new Array<Suchtreffer>();
                    }
                    trefferliste.map((element: any) => {
                        let suchtreffer = new Suchtreffer(
                            element["idmedikament"],
                            element["pzn"],
                            element["name"],
                            element["kategorie"],
                        );
                        this.suchtrefferList.push(suchtreffer);
                        console.log("newsuchtreffer: ", suchtreffer);
                    })
                }
            })
    }

    /**
     * holt Medikamentendaten vom Server - keine Bestands-Daten. 
     * @param medid 
     */
    getMedikamentFromServer(medid: number): Promise<Med> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('function', '3');
        params.set('medid', medid.toString());
        let options = new RequestOptions();
        options.search = params;
        console.log("getMedikamentvomServer: ", medid);
        return this.http.get('http://localhost:8080/info', options)
            .toPromise()
            .then(
            (response: Response) => {
                let jsonData = response.json();
                console.log("Promise im then", jsonData);
                let newmed = new Med();
                newmed.setidmedikament(jsonData['idmedikament']);
                newmed.setname(jsonData['name']);
                newmed.setpzn(jsonData['pzn']);
                newmed.setkategorie(jsonData['kategorie']);
                newmed.setapothekenpflichtig(jsonData['apothekenpflichtig']);
                newmed.setanwendungsgebiet(jsonData['anwendungsgebiet']);
                newmed.setwirkungsweise(jsonData['wirkungsweise']);
                newmed.setwirkstoffe(jsonData['wirkstoffe']);
                newmed.setgegenanzeigen(jsonData['gegenanzeigen']);
                newmed.setdosierung(jsonData['dosierung']);
                newmed.setentsorgung(jsonData['entsorgung']);
                newmed.setpfadbild(jsonData['pfadbild']);
                newmed.setpfadbeipackzettel(jsonData['pfadbeipackzettel']);
                console.log("newmed Promise im then", newmed);
                this.med = newmed;
                return newmed;
            })
            .catch(
            (response: Response) => {
                console.log("getMedikamentFromServer catch-Fehler");
                return this.med;
            }
            );
    }
    /**
     * liefert Medikamenten- und Bestandsdaten anhand einer Bestands-ID
     * @param bestandid  
     */
    getMedikamentBestandFromServer(bestandid: number): Promise<Med> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('function', '5');
        params.set('bestandid', bestandid.toString());
        let options = new RequestOptions();
        options.search = params;
        console.log("getMedikamentBestandvomServer: ", bestandid);
        return this.http.get('http://localhost:8080/info', options)
            .toPromise()
            .then(
            (response: Response) => {
                let jsonData = response.json();
                console.log("Promise im then", jsonData);
                let newmed = new Med();
                newmed.setidbestand(jsonData['idbestand']);
                newmed.setidmedikament(jsonData['idmedikament']);
                newmed.setname(jsonData['name']);
                newmed.setpzn(jsonData['pzn']);
                newmed.setbestand(jsonData['bestand']);
                newmed.setablaufdatumnumber(jsonData['ablaufdatum']);
                newmed.setkategorie(jsonData['kategorie']);
                newmed.setapothekenpflichtig(jsonData['apothekenpflichtig']);
                newmed.setanwendungsgebiet(jsonData['anwendungsgebiet']);
                newmed.setwirkungsweise(jsonData['wirkungsweise']);
                newmed.setwirkstoffe(jsonData['wirkstoffe']);
                newmed.setgegenanzeigen(jsonData['gegenanzeigen']);
                newmed.setdosierung(jsonData['dosierung']);
                newmed.setentsorgung(jsonData['entsorgung']);
                newmed.setpfadbild(jsonData['pfadbild']);
                newmed.setpfadbeipackzettel(jsonData['pfadbeipackzettel']);
                console.log("newmed Promise im then", newmed);
                this.med = newmed;
                return newmed;
            })
            .catch(
            (response: Response) => {
                console.log("getMedikamentBestandBestandFromserver catch-Fehler");
                return this.med;
            }
            );
    }
    /**
     * nimmt die Benutzerdaten von Bestand und Medikamenten-ID entgegen
     * Legt damit einen neuen Bestand am Server an.  
     * @param medKlein1 die Bestandsdaten und Medikamenten-ID des neuen Bestandes 
     */
    addBestandToServer(medKlein1: MedKlein) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('function', '2');
        params.set('userid', '2');
        params.set('medid', medKlein1.getidmedikament().toString());
        if (medKlein1.getablaufdatum() != undefined)
            params.set('ablaufdatum', medKlein1.getablaufdatum().toString());
        if (medKlein1.getbestand() != undefined)
            params.set('bestand', medKlein1.getbestand().toString());

        let options = new RequestOptions();
        options.search = params;
        return this.http.get('http://localhost:8080/info', options)
            .toPromise()
            .then((response: Response) => {
                const jsonData = response.json();
                let idbestand = jsonData['idbestand']; 6
                medKlein1.setidbestand(idbestand);
                console.log("addBestandToServer: idbestand", idbestand);
                this.medList.push(medKlein1);
            })
    }

    /**
     * nimmt die Benutzerdaten von Bestand und Medikamenten-ID entgegen
     * ändert damit die Bestandsdaten Ablaufdatum und Bestand  
     * @param medKlein1 die Bestandsdaten und Medikamenten-ID des bestehenden Bestandes 
     */
    changeBestandToServer(medKlein1: MedKlein, ablaufdatumstring: String, bestandstring: String) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('function', '7');
        params.set('userid', '2');
        console.log("changeBestandToServer ablaufdatumString = ", ablaufdatumstring);
        params.set('idbestand', medKlein1.getidbestand().toString());
        params.set('idmedikament', medKlein1.getidmedikament().toString());
        // Prüfung, ob eine Veränderung des Bestandswertes vorliegt
        console.log("changeBestand Bestand ist und war ", bestandstring, "  ", medKlein1.getbestand());
        if (typeof bestandstring !== 'undefined' && bestandstring.length > 0) {
            if (bestandstring.toString !== medKlein1.getbestand().toString) {
                params.set('bestand', bestandstring.toString());
            }
        }

        // Prüfung ob eine Veränderung des Ablaufdatums vorliegt 
        let millis;
        if (typeof ablaufdatumstring !== 'undefined' && ablaufdatumstring.length > 1) {
            millis = Date.parse(ablaufdatumstring.toString());
            params.set('ablaufdatum', millis.toString());
            console.log("changeBestandToServer: ablaufdatum: ", millis);
        }
        if (typeof bestandstring !== 'undefined' && bestandstring.length > 1)
            params.set('bestand', bestandstring.toString());


        let options = new RequestOptions();
        options.search = params;
        return this.http.get('http://localhost:8080/info', options)
            .toPromise()
            .then((response: Response) => {
                const jsonData = response.json();
                let idbestand = jsonData['idbestand'];
                let fehlercode = jsonData['fehlercode'];
                console.log("addBestandToServer: idbestand", idbestand);
                // TODO im Fehlerfall muss die Änderung zurück gedreht werden.  
            })
    }

    // zu Test-Zwecken
    private extractData(res: Response) {
        console.log("res: " + res);
        let body = res.json();
        console.log("json: " + body);
        console.log("data: " + body.data);
        return body.data || {};
    }


    private handleError(error: Response | any) {
        console.log('Error-nachricht: ' + error.toString);
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `Fehler aufgetreten`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    /*    
        neues Medikament wird erfasst und der Liste hinzugefügt
        MedNeu liefert die Daten der Erfassungsmaske
        Med liefert das vollständige Medikament zurück 
        im Fehlerfall -undefined-
        Formatprüfungen sind bereits erfolgt
        */
    addNewMed(medNeu: MedNeu): Med {

        // 1. am Server das neue Medikament anfragen
        this.med = this.getMedTest(medNeu.pzn);

        // 2. die Antwort prüfen 
        if (typeof this.med === undefined) {
            // Fehlerfall
            console.log('Med ist undefined');
        }
        else {
            this.medList.push(this.medKlein1);
            console.log('neues Med im MedService', this.medList.length);
            // ok-Fall
            //            console.log("Service: addNewMed", this.medList.length, this.med.pzn);
            // 3. ok: das Ergebnis der Liste hinzufügen
            //            this.medList.push(this.makeMedKleinFromMed(this.med));
            //            console.log("Service: addNewMed", this.medList.length, this.med.pzn);
        }
        // 4. das Ergebnis zurückgeben
        return this.med;
    }

    /**
     * Löscht ein Bestands-Element in der DB und in der Bestands-Liste 
     * @param inputMedKlein das zu löschende Bestands-Element
     */
    removeBestandFromServer(inputMedKlein: MedKlein) {
        // aus dem Bestand löschen 
        let params: URLSearchParams = new URLSearchParams();
        console.log("removeMedFromServer: ", inputMedKlein);
        let idbestand = inputMedKlein.getidbestand();
        params.set('idbestand', idbestand.toString());
        params.set('function', '6');

        let options = new RequestOptions();
        options.search = params;
        return this.http.get('http://localhost:8080/info', options)
            .toPromise()
            .then((response: Response) => {
                const jsonData = response.json();
                let fehlercode = jsonData['fehlercode'];
                if (fehlercode == 0) {
                    // aus der Liste Löschen 
                    let x = this.medList.findIndex(
                        (item: MedKlein) => {
                            if (item.getidbestand() == idbestand)
                                return true;
                            else return false;
                        }
                    )
                    console.log("remove Indexposition: ", x);
                    this.medList.splice(x, 1);
                }
                console.log("deleteBestandToServer: idbestand: ", idbestand);
            })
    }

    filterCheckNone() {
        this.filter.durchfall = false;
        this.filter.erkaeltung = false;
        this.filter.schmerz = false;
    }

    filterCheckAll() {
        this.filter.durchfall = true;
        this.filter.erkaeltung = true;
        this.filter.schmerz = true;
    }

    sortiereMedList(sortierung: string) {
        if (sortierung == "name") {
            console.log("Sortierung nach: ", sortierung);
            this.medList = this.medList.sort((h1, h2) => {
                return h1.getname() < h2.getname() ? -1 :
                    (h1.getname() > h2.getname() ? 1 : 0);
            });
        }
        else if (sortierung == "kategorie") {
            this.medList = this.medList.sort((h1, h2) => {
                return h1.getkategorie() < h2.getkategorie() ? -1 :
                    (h1.getkategorie() > h2.getkategorie() ? 1 : 0);
            });
        }
        else if (sortierung == "datum") {
            this.medList = this.medList.sort((h1, h2) => {
                return h1.getablaufdatum() < h2.getablaufdatum() ? -1 :
                    (h1.getablaufdatum() > h2.getablaufdatum() ? 1 : 0);
            });
        }

    }

}