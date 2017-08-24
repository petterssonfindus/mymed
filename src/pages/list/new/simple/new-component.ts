import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MedNeu } from "../../../../app/medneu.model";
import { Med } from "../../../../app/med.model";
import { MedService } from "../../../../app/med.service";
import { MedPageComponent } from "../../med-page/med-page.component";


@Component({
    selector: 'page-new',
    templateUrl: 'new-component.html'
})

/*
    Erfassungs-Komponente für neues Medikament
    wird als MedKlein zurück gegeben. 
*/
export class NewComponent {

    @Output() newEvent: EventEmitter<MedNeu>;
    medNeu: MedNeu;
    med: Med;
    ablaufdatum: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private medService: MedService
    ) {
        this.ablaufdatum = "2017-01-01";
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewPage');
    }

    // Erfassung wird abgeschlossen
    clickMedNeu(pzn, bestand) {
        this.medNeu = new MedNeu(pzn, this.ablaufdatum, bestand);
        //        this.newEvent.emit(this.medNeu);
        this.med = this.medService.addNewMed(this.medNeu);
        console.log("med = ", this.medNeu);
        this.navCtrl.pop();
        this.navCtrl.push(MedPageComponent, { item: this.med });
    }

    clickCancel() {
        this.navCtrl.pop();
    }


}
