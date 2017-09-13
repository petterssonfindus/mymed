import { Component, Input } from '@angular/core';
import { MedService } from "../../../app/med.service";
import { Med } from "../../../app/med.model";
import { MedKlein } from "../../../app/medklein.model";

@Component({
    selector: 'bestand',
    templateUrl: 'bestand.component.html'
})
export class BestandComponent {

    bestandzahl: String;
    ablaufdatumstring: String;
    private pfadabgelaufen = "/assets/pictures/abgelaufen.png";
    
    // bekommt ein Data-Bindung mit dem anzuzeigenden Datum und Betrag
    @Input() initablaufdatum: String;
    @Input() initbestand: String;
    
    constructor(
        private medService: MedService
    ) {    }

    ngOnInit() {
        // die von außen gesetzten Initialwerte werden eingesetzt. 
        this.ablaufdatumstring = this.initablaufdatum;
        this.bestandzahl = this.initbestand;
    }

}