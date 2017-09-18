import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Med } from '../../../app/med.model';
import { MedService } from "../../../app/med.service";
import { MedDetailComponent } from "../med-detail/med-detail.component";
import { MedKlein } from "../../../app/medklein.model";
import { NewSearchComponent } from "../new/newsearch.component";
import { BestandComponent } from "../bestand/bestand.component";

@Component({
    selector: 'med-page',
    templateUrl: 'med-page.component.html',
})

/**
 * stellt ein Medikament vollständig dar incl. aller Daten
 * die Bestandsdaten stehen zur Bearbeitung zur Verfügung 
 * wird genutzt bei der Bestands-Neuanalge und bei der Bestands-Bearbeitung.  
 * bei der Neu-Anlage stehen die Buttons "Speichern" und "Abbrechen" zur Verfügung. 
 * bei der Bearbeitung stehen die Buttons "Speichern" und "Entfernen zur Verfügung. 
 */
export class MedPageComponent {

    med: Med;    // das Medikament, das präsentiert wird 
    medid: number;
    neuanlage: boolean = true; // steuert die Buttons die erscheinen. Beschreibung s.o.   
    initablaufdatum: String;  // wird an die Bestand-Component weiter gegeben 
    initbestand: String;  // wird an die Bestand-Component weiter gegeben 
    private pfadabgelaufen = "/assets/pictures/abgelaufen.png";
    private pfadapothekenpflichtig = "/assets/pictures/aposymbol3.png";
    private pfadentsorgunghausmuell = "/assets/pictures/hausmuell3.png";
    private pfadentsorgunghausmuellverboten = "/assets/pictures/hausmuellverboten2.png";
    private pfadentsorgungkloverboten = "/assets/pictures/klo2.png";
//    private pfadmedbild = "http://localhost:8080/picture/00829388.jpg";


    @Output() deleteEvent = new EventEmitter<Med>();
    /**
     * Inject der Child-Component mit Zugriff auf deren Attribute und Methoden 
     * das Ergebnis der Benutzereingabe wird darüber ermittelt
     */
    @ViewChild(BestandComponent) private bestandComponent: BestandComponent;

    /**
     * stellt ein Medikament vollständig dar incl. allen Daten
     * @param navCtrl 
     * @param medService 
     * @param params enthält den Parameter 'medid' mit der internen Med-Nummer und "neuanlage" 
     */
    constructor(
        private navCtrl: NavController,
        private medService: MedService,
        params: NavParams) {
        this.medid = params.data.medid;
        this.neuanlage = params.data.neuanlage;
        this.med = medService.getMed();
        console.log("Medikament-Erzeugung2 id = ", this.medid);
        console.log("med-page init: ", this.med);
        //        this.medService.getMedikamentFromServer(this.medid).subscribe();
    }

    /**
     * die anzuzeigenden Werte werden initialisiert 
     */
    ngOnInit() {
        console.log("MedPageComponent: Med nach ngOnInit:", this.med);
        // falls ein Ablaufdatum existiert, wird dieses formatiert 
        if (typeof this.med.getablaufdatum() != "undefined") {
            this.initablaufdatum = this.med.getablaufdatum().toISOString().substring(0, 10);
        }
        // falls ein Bestand existiert, wird dieser formatiert
        if (typeof this.med.getbestand() != "undefined") {
            this.initbestand = this.med.getbestand().toString();
        }
    }
    /**
     * speichert einen neuen Bestand für einen Benutzer
     * die vom Benutzer erfassten Bestands-Daten werden an den Service weiter gegeben.
     */
    clickNewMed() {
        console.log("clickNewMed in MedPage vor Server", this.med);
        this.medService.addBestandToServer(this.med, this.bestandComponent.ablaufdatumstring, this.bestandComponent.bestandzahl);
        // die Erfassungs-Maske wieder schließen. 
        this.navCtrl.pop();
    }
    /**
     * entfernt einen vorhandenen Bestand
     * synchron: wartet, bis die Erfolgsmeldung vom Server eintrifft
     * steht nur bei Bestands-Anzeige zur Verfügung
     */
    clickDelMed() {
        let test: Promise<any> = this.medService.removeBestandFromServer(this.med);
        test.then(
            (response: Response) => {
                this.navCtrl.pop();
            }
        )
    }
    /**
     * speichert die Bestandsveränderung durch Benutzereingabe in einem bestehenden Bestand. 
     */
    clickSaveMed() {
        console.log("clickSaveMed: bestandComponent.ablaufdatumString = ", this.bestandComponent.ablaufdatumstring);
        let test: Promise<any> = this.medService.changeBestandToServer(
            this.med, this.bestandComponent.ablaufdatumstring, this.bestandComponent.bestandzahl);
        test.then(
            (response: Response) => {
                this.navCtrl.pop();
            }
        )
    }
    /**
     * der Benutzer möchte eine bestimmte Detail-Seite sehen
     */
    clickAnwendungsgebiet() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 1 });
    }
    clickWirkstoffe() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 2 });
    }
    clickWirkungsweise() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 3 });
    }
    clickGegenanzeigen() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 4 });
    }
    clickDosierung() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 5 });
    }
    clickEntsorgung() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 6 });
    }
    /**
     * die Adresse setzt sich zusammen aus dem Pfad + dem Namen 
     * der Pfad wird im MedService gehalten, der Name stammt aus dem Medikament
     */
    getpfadmedbild() {
        return this.medService.getPfadMedBild() + this.med.getnamebild();
    }
    /**
     * dient der UI zur Anzeige der Symbole
     */
    getapothekenpflichtig(): boolean {
        return this.med.getapothekenpflichtig() == 0;
    }

    getistabgelaufen(): boolean {
        return this.med.getistabgelaufen();
    }

    getentsorgunghausmuell(): boolean {
        return this.med.getentsorgunghausmuell();
    }
    getentsorgunghausmuellverboten(): boolean {
        return this.med.getentsorgunghausmuellverboten();
    }
    getentsorgungkloverboten(): boolean {
        return this.med.getentsorgungkloverboten();
    }


}
