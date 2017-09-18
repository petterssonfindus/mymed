import { Component } from '@angular/core';
import { MedService } from "../../../app/med.service";
import { NavController } from "ionic-angular";
import { MedPageComponent } from "../med-page/med-page.component";
import { Suchtreffer } from "../../../app/suchtreffer";

@Component({
    selector: 'newsearch',
    templateUrl: 'newsearch.component.html'
})

export class NewSearchComponent {

    searchQuery: string = '';
    items: Suchtreffer[];

    constructor(
        private medService: MedService,
        private navCtrl: NavController) {
        console.log("constructor SearchComponent");
        this.initializeItems();
    }
    initializeItems() {
        this.items = this.medService.getSuchtrefferListe();
    }



    // wird bei jedem Tastendruck aufgerufen
    getItems(ev: any) {
        console.log("getItems neu2: ", ev);

        // set val to the value of the searchbar
        let val = ev.target.value;
        console.log("Suchstring ist lang: ", val.length);
        // ist der Such-String leer oder < 4 Zeichen 
        if (val.length > 3 && val.trim() != '') {
            this.initializeItems();
            this.medService.searchMedFromServer(ev);

            //            this.items = this.items.filter((item) => {
            //                return (item.getname().toLowerCase().indexOf(val.toLowerCase()) > -1);
            //            })
        }
    }
    /**
     * ein Such-Treffer wird vom Benutzer ausgewählt, um damit einen Bestand zu erfassen 
     * 
     * @param item der ausgewählte Suchtreffer vom Typ Suchtreffer
     */
    clickItemSelected(item: any) {
        //        console.log("Item selected:", item);
        let x = this.items.indexOf(item);
        // holt die Medikamenten-Daten vom Server - synchron
        let test: Promise<any> = this.medService.getMedikamentFromServer(item.getid());
        // wenn das Ergebnis eintrifft
        test.then(
            (response: Response) => {
                console.log("clickItemSelected: ", this.medService.getMed());
                this.navCtrl.push(MedPageComponent, { medid: item.getid(), neuanlage: false });
            }
        )

        console.log("ausgewähltes Element: ", x, item);
        this.navCtrl.push(MedPageComponent, { item: item });
    }

}

