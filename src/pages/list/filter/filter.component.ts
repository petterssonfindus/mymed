import { Component } from '@angular/core';
import { MedService } from "../../../app/med.service";
import { Filter } from "../../../app/filter.model";
import { NavController } from "ionic-angular";

@Component({
    selector: 'filter',
    templateUrl: 'filter.component.html'
})
export class FilterComponent {
    filter: Filter;

    constructor(private navCtrl: NavController, private medService: MedService) {
        this.filter = medService.getFilter();
    }

    clickAll() {
        this.medService.filterCheckAll();
    }

    clickNone() {
        this.medService.filterCheckNone();
    }

    clickSave() {
        this.navCtrl.pop();
    }


}
