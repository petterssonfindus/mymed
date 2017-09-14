import { Component, Input, OnInit } from '@angular/core';
import { MedKlein } from '../../../app/medklein.model';

@Component({
    selector: 'list-element',
    templateUrl: 'list-element.component.html'
    //    styleUrls: 'list-element.component.scss'
})
/**
 * stellt ein Bestandselement in einer Liste dar
 */
export class ListElementComponent {
    /**
     * die anzuzeigenden Daten werden als Input-Bindung übergeben. 
     */
    @Input() med: MedKlein;

    private pfadabgelaufen = "/assets/pictures/abgelaufen.png";
    private pfadapothekenpflichtig = "/assets/pictures/aposymbol3.png";
    private pfadentsorgunghausmuell = "/assets/pictures/hausmuell3.png";
    private pfadentsorgunghausmuellverboten = "/assets/pictures/hausmuellverboten2.png";
    private pfadentsorgungkloverboten = "/assets/pictures/klo2.png";
    
    /**
     * dient der UI zur Anzeige der Symbole
     */
    getapothekenpflichtig(): boolean {
        return this.med.getapothekenpflichtig() == 0; 
    }

    getistabgelaufen(): boolean {
        return this.med.getistabgelaufen();
    }

    getentsorgunghausmuell() : boolean {
        return this.med.getentsorgunghausmuell();
    }
    getentsorgunghausmuellverboten(): boolean {
        return this.med.getentsorgunghausmuellverboten();
    }
    getentsorgungkloverboten(): boolean {
        return this.med.getentsorgungkloverboten();
    }

}
