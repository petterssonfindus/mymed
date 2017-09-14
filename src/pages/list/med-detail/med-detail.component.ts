import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from "ionic-angular";
import { Med } from "../../../app/med.model";

@Component({
    selector: 'med-detail/',
    templateUrl: 'med-detail.component.html',
    styles: ['h1 {color: blue;}']
})

// zeigt die 5 Detail-Seiten des Medikaments
// Anwendungsgebiet, Wirkstoffe, Gegenanzeigen, Dosierung, Entsorgung
export class MedDetailComponent {
    // Zugriff auf die IONIC-Slides-Komponente
    @ViewChild('meddetailslides') slides: Slides;
    // das darzustellende Medikament
    private med: Med;
    // das Sachgebiet als Zahl, das der Benutzer sehen möchte
    private gebiet: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams
    ) {
        // das Medikament wird über die Params übergeben 
        this.med = navParams.data.item;
        // das anzuzeigende Sachgebiet wird über die Params übergeben 
        this.gebiet = navParams.data.gebiet;
    }

    ngOnInit() {
    }

    ionViewDidLoad() {
        // alle Seiten werden mit Text befüllt
        // der HTML-formatierte Text wird als 'innerHTML' eingefügt 
        document.getElementById('idanwendungsgebiet').innerHTML = this.med.getanwendungsgebiet();
        document.getElementById('idwirkstoffe').innerHTML = this.med.getwirkstoffe();
        document.getElementById('idwirkungsweise').innerHTML = this.med.getwirkungsweise();
        document.getElementById('idgegenanzeigen').innerHTML = this.med.getgegenanzeigen();
        document.getElementById('iddosierung').innerHTML = this.med.getdosierung();
        document.getElementById('identsorgung').innerHTML = this.getEntsorgungText();
    }

    /**
     * das gewünschte Slide wird angesteuert
     * sobald die View geladen ist und angezeigt wird 
     */
    ionViewDidEnter() {
        if (typeof this.gebiet != 'undefined' && this.gebiet != 0) {
            this.slides.slideTo(this.gebiet-1);
        }
    }

    private getEntsorgungText() : string {
        let test = this.med.getentsorgung();
        let result = "";
        switch (test) {
            case 1: {
                result = "keine besonderen Entsorgungshinweise <br>Die entsorgung kann über Hausmüll erfolgen";
                break;
            }
            case 2: {
                result = "Entsorgung darf keinesfalls über die Haustoilette erfolgen<br> Hausmüll ist die die geeignete Entsorgung";
                break;
            }
            case 3: {
                result = "Entsorgung dieses Medikament ist kritisch.<br> Keinesfalls in der Haustoilette. Bitte auch nicht im Klo.<br>Bitte suchen Sie geeignete Entsorgungsstellen auf.";
                break;
            }
        }
        return result;
    } 
}

