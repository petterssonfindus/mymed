import { Component } from '@angular/core';
import { MedService } from "../../../app/med.service";
import { MedKlein } from "../../../app/medklein.model";
import { NavController } from "ionic-angular";
import { MedPageComponent } from "../med-page/med-page.component";

@Component({
    selector: 'search',
    templateUrl: 'search.component.html'
})

export class SearchComponent {

    searchQuery: string = '';
    //    items: string[];
    items: MedKlein[];

    constructor(
        private medService: MedService,
        private navCtrl: NavController) {
        this.initializeItems();
    }


    initializeItems() {
        this.items = this.medService.getMedList();
    }


    // wird bei jedem Tastendruck aufgerufen
    getItems(ev: any) {
        console.log("getItems: ", ev);
        // Reset items back to all of the items
        this.initializeItems();

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.items = this.items.filter((item) => {
                return (item.getname().toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    clickItemSelected(item: any) {
        //        console.log("Item selected:", item);
        let x = this.items.indexOf(item);
        console.log(x, item.name);
        this.navCtrl.push(MedPageComponent, { item: item });
    }

}

