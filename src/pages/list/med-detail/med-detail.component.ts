import { Component } from '@angular/core';
import { NavController, NavParams } from "ionic-angular";
import { Med } from "../../../app/med.model";

@Component({
    selector: 'med-detail',
    templateUrl: 'med-detail.component.html'
})
// zeigt die 5 Detail-Seiten des Medikaments
// Anwendungsgebiet, Wirkstoffe, Gegenanzeigen, Dosierung, Entsorgung
export class MedDetailComponent {
    private med: Med;
    private gebiet: number;
    private gebietName: String;
    private inhalt: string;
    private gebietNameEnum: string[];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams
    ) {
        this.gebietNameEnum = ['Anwendungsgebiet', 'Wirkstoffe', 'Gegenanzeigen', 'Dosierung', 'Entsorgung'];
        this.med = navParams.data.item;
        this.gebiet = navParams.data.gebiet;
        this.gebietName = this.gebietNameEnum[this.gebiet - 1];
    }

    ngOnInit() {
        switch (this.gebiet) {

            case 1: {
                this.inhalt = this.med.getanwendungsgebiet();
                break;
            }
            case 2: {
                this.inhalt = this.med.getwirkstoffe();
                break;
            }
            case 3: {
                this.inhalt = this.med.getgegenanzeigen();
                break;
            }
            case 4: {
                this.inhalt = this.med.getdosierung();
                break;
            }
            case 5: {
                this.inhalt = "Standard-Text zur Entsorgung";
                break;
            }
            case 6: {
                this.inhalt = this.med.getwirkungsweise();
                break;
            }
        }
    }


}

