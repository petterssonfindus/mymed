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
import { BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class MedService {

    //     private medKlein: MedKlein;  // 
    private med: Med;  // das Medikament das bearbeitet wird
    //    private medList: [MedKlein] = new MedList().getMedList();
    //    private medList = new Subject<Med>();
    // medList$ = this.medList.asObservable();

    test: any;
    filter: Filter;

    // Observable Liste der Medikamente, die in der List-Component dargestellt werden.
    // darauf kann sich jeder registrieren, um sich über Änerungen benachrichtigen zu lassen. 
    private medList2: BehaviorSubject<MedKlein[]>;
    // das Array, das die Bestands-Liste enthält 
    private medList: MedKlein[];
    // die URL des Servers für Services
    private serveradresse = 'http://localhost:8080/info';
    // die URL 
    private pfadmedbild = "http://localhost:8080/picture/";
    

    //    medList: MedKlein[];  // die Liste 
    suchtrefferList: Array<Suchtreffer>;  // die Suchtreffer, die in der Search-Component dargestellt wird. 

    constructor(private http: Http) {
        this.medList = new Array<MedKlein>();
        this.medList2 = <BehaviorSubject<MedKlein[]>>new BehaviorSubject(null);

        this.med = new Med();
        this.suchtrefferList = new Array<Suchtreffer>();
        this.filter = new Filter();
        this.filter.durchfall = true;
        this.filter.erkaeltung = true;
        this.filter.schmerz = true;
        this.testObservable();
    }
    /**
     * bietet Zugriff auf die Adresse zur Ablage der Bilder
     */
    getPfadMedBild() {
        return this.pfadmedbild;
    }

    testObservable2(test: string) {
        console.log("testObservable2 mit Wert: ", test);
    }

    testObservable() {
        let teststring = "i";
        let bs = new BehaviorSubject("a");
        bs.next("b");
        bs.subscribe((value) => this.testObservable2(value));
        bs.next("c");
        //        funktioniert nicht, weil ECMAScript6 nicht zur Verfügung steht 
        //        bs.next(Object.assign({}, teststring));

        let a = this.getMedList2()
            .map(
            medKlein => console.log("medKlein gefunden: ", medKlein)
            );
    }

    getMed(): Med {
        return this.med;
    }
    /**
     * Zugriff auf die Liste in Form eines Observable
     * asynchrone Benachrichtigung bei Veränderung 
     */
    getMedList2() {
        return this.medList2.asObservable();
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
    /**
     * nur zu Test-Zwecken
     * die Liste in Form eines String-Array
     */
    getMedListAsStrings(): string[] {
        var medStrings: string[] = new Array<string>();
        this.getMedList().forEach(element => {
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
        return this.http.get(this.serveradresse, options)
            .toPromise()
            .then((response: Response) => {
                const jsonData = response.json();
                let derbestand: Array<any> = jsonData['trefferliste'];
                console.log("derBestand: ", derbestand);
                let returnArray = [];
                // die bestehende Liste wird gelöscht 
                this.medList.splice(0, this.medList.length);
                derbestand.map((element: any) => {
                    // mit dem Konstruktor werden die Daten aus dem Response in das MedKlein übergeben 
                    let newMedKlein = new MedKlein(
                        element["idbestand"],
                        element["idmedikament"],
                        element["pzn"],
                        element["name"],
                        element["kategorie"],
                        element["ablaufdatum"],
                        element["bestand"],
                        element["apothekenpflichtig"],
                        element["entsorgung"]
                    );
                    this.medList.push(newMedKlein);
                    this.medList2.next(this.medList);
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
        return this.http.get(this.serveradresse, options)
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
        return this.http.get(this.serveradresse, options)
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
        return this.http.get(this.serveradresse, options)
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
     * @param medKlein die Bestandsdaten und Medikamenten-ID des neuen Bestandes 
     */
    addBestandToServer(medKlein: MedKlein, ablaufdatumstring: String, bestandstring: String) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('function', '2');
        params.set('userid', '2');
        params.set('medid', medKlein.getidmedikament().toString());
        // Benutzereingaben prüfen und Parameter damit befüllen 
        this.getParamsForBestand(medKlein, params, ablaufdatumstring, bestandstring);

        let options = new RequestOptions();
        options.search = params;
        return this.http.get(this.serveradresse, options)
            .toPromise()
            .then((response: Response) => {
                const jsonData = response.json();
                // holt die ID des neu angelegten Bestands aus dem Response
                let idbestand = jsonData['idbestand'];
                // schreibt die neu angelegte ID in den Bestand
                medKlein.setidbestand(idbestand);
                console.log("addBestandToServer: idbestand", idbestand);
                // die gesamte Liste wird vom Server wieder geladen
                // die bestehende medList wir nicht mit push erweitert. 
                // this.medList.push(medKlein);
                // Aktualisierung des Bestandes durchführen 
                this.getMedListFromServer2();
            })
    }
    /**
     * prüft, ob sinnvolle Benutzereingaben vorhanden sind 
     * und befüllt damit die Parameter
     * wird bei Neu-Anlage und bei Veränderung genutzt
     * @param params die Parameter, die ergänzt werden 
     * @param ablaufdatumstring das Ablaufdatum als String des Benutzers 
     * @param bestandstring  die Bestandszahl als String
     */
    private getParamsForBestand(medKlein: MedKlein, params: URLSearchParams, ablaufdatumstring: String, bestandstring: String) {
        // Prüfung, ob eine Veränderung des Bestandswertes vorliegt
        console.log("changeBestand Bestand ist und war ", bestandstring, "  ", medKlein.getbestand());
        if (typeof bestandstring !== 'undefined' && bestandstring.length > 0) {     // enthält einen sinnvollen Wert 
            // der alte Wert war nicht vorhanden oder der Wert hat sich geändert 
            if ((typeof medKlein.getbestand() == "undefined") || (bestandstring.toString !== medKlein.getbestand().toString)) {
                // Parameter werden erweitert 
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
    }

    /**
     * nimmt die Benutzerdaten von Bestand und Medikamenten-ID entgegen
     * ändert damit die Bestandsdaten Ablaufdatum und Bestand  
     * @param medKlein die Bestandsdaten und Medikamenten-ID des bestehenden Bestandes 
     */
    changeBestandToServer(medKlein: MedKlein, ablaufdatumstring: String, bestandstring: String) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('function', '7');
        params.set('userid', '2');
        console.log("changeBestandToServer ablaufdatumString = ", ablaufdatumstring);
        params.set('idbestand', medKlein.getidbestand().toString());
        params.set('idmedikament', medKlein.getidmedikament().toString());
        // Benutzereingaben prüfen und Parameter damit befüllen 
        this.getParamsForBestand(medKlein, params, ablaufdatumstring, bestandstring);
        // den Service-Request abschicken 
        let options = new RequestOptions();
        options.search = params;
        return this.http.get(this.serveradresse, options)
            .toPromise()
            .then((response: Response) => {
                const jsonData = response.json();
                let idbestand = jsonData['idbestand'];
                let fehlercode = jsonData['fehlercode'];
                // Aktualisierung des Bestandes durchführen 
                this.getMedListFromServer2();
                console.log("changeBestandToServer: idbestand", idbestand);
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
            this.medList.push(null);
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
        return this.http.get(this.serveradresse, options)
            .toPromise()
            .then((response: Response) => {
                const jsonData = response.json();
                let fehlercode = jsonData['fehlercode'];
                if (fehlercode == 0) {    // das Löschen hat funktioniert. 
                    // Aktualisierung des Bestandes durchführen 
                    this.getMedListFromServer2();
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