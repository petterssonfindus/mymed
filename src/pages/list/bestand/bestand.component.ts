import { Component, Input } from '@angular/core';
import { MedService } from "../../../app/med.service";
import { Med } from "../../../app/med.model";
import { MedKlein } from "../../../app/medklein.model";

@Component({
    selector: 'bestand',
    templateUrl: 'bestand.component.html'
})
export class BestandComponent {
    med: Med;
    textfeld: String;
    bestandzahl: String;
    ablaufdatum: Date;
    ablaufdatumtext: String;
    
    // bekommt ein Data-Bindung beim Aufruf der Komponente
    @Input() medKlein: MedKlein;

    constructor(
        private medService: MedService
    ) {
        this.med = medService.getMed();
        this.med.setablaufdatum(new Date(new Date().setFullYear(2020, 11, 30)));
        // Initialwert des Textfeldes setzen
        if (this.med.getablaufdatum() != undefined) {
            this.ablaufdatum = this.med.getablaufdatum();
        }
        console.log("Ablaufdatumtext = ", this.ablaufdatum);
    }

}