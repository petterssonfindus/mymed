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
 */
export class MedPageComponent {

    med: Med;
    medid: number;
    bestandanzeigen: boolean = true;
    initablaufdatum: String;  // wird an die Bestand-Component weiter gegeben 
    initbestand: String;  // wird an die Bestand-Component weiter gegeben 
    @Output() deleteEvent = new EventEmitter<Med>();
    // Inject der Child-Component mit Zugriff auf deren Attribute und Methoden 
    // das Ergebnis der Benutzereingabe wird darüber ermittelt
    @ViewChild(BestandComponent) private bestandComponent: BestandComponent;

    /**
     * stellt ein Medikament vollständig dar incl. allen Daten
     * @param navCtrl 
     * @param medService 
     * @param params enthält den Parameter 'medid' mit der internen Med-Nummer
     */
    constructor(
        private navCtrl: NavController,
        private medService: MedService,
        params: NavParams) {
        this.medid = params.data.medid;
        this.bestandanzeigen = params.data.bestandanzeigen;
        this.med = medService.getMed();
        console.log("Medikament-Erzeugung2 id = ", this.medid);
        console.log("med-page init: ", this.med);
        //        this.medService.getMedikamentFromServer(this.medid).subscribe();
    }

    ngOnInit() {
        // holt das große Med anhand der medid
        console.log("Med nach ngOnInit:", this.med);
        this.initablaufdatum = this.med.getablaufdatum().toISOString().substring(0,10);
        this.initbestand = this.med.getbestand().toString();
    }
    /**
     * speichert einen neuen Bestand für einen Benutzer
     */
    clickNewMed() {
        console.log("clickNewMed in MedPage vor Server", this.med);
        this.medService.addBestandToServer(this.med);
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

    clickAnwendungsgebiet() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 1 });
    }
    clickWirkstoffe() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 2 });
    }
    clickGegenanzeigen() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 3 });
    }
    clickDosierung() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 4 });
    }
    clickEntsorgung() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 5 });
    }
    clickWirkungsweise() {
        this.navCtrl.push(MedDetailComponent, { item: this.med, gebiet: 6 });
    }

}
