import { Component, Input, OnInit } from '@angular/core';
import { MedKlein } from '../../../app/medklein.model';

@Component({
    selector: 'list-element',
    templateUrl: 'list-element.component.html'
    //    styleUrls: 'list-element.component.scss'
})
export class ListElementComponent implements OnInit {

    @Input() med: MedKlein;

    ngOnInit() {
        console.log('Med', this.med.getname(), this.med.getpzn(), this.med.getistabgelaufen());
    }


}
