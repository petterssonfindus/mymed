import { Component } from '@angular/core';
import { NavController } from "ionic-angular";

import { Suchtreffer } from "../../../../app/suchtreffer";
import { MedService } from "../../../../app/med.service";
import { MedPageComponent } from "../../med-page/med-page.component";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'newmed',
    templateUrl: 'new-med.component.html'
})
/**
 * unterstützt die Auswahl eines Medikaments mit dem Ziel, 
 * einen neuen Bestand mit diesem Medikament zu erfassen. 
 */
export class NewMedComponent {

    searchQuery: string = '';
    items: Suchtreffer[];
    searchbar: any;

    constructor(
        private medService: MedService,
        private navCtrl: NavController) {
    }

    ionViewWillLeave() {
        this.medService.clearSuchtrefferListe();
        this.items = new Array<Suchtreffer>();
        this.searchbar.value = "";
    }


    // wird bei jedem Tastendruck aufgerufen
    getItems(ev: any) {
        // die Referenz zur Search-Bar speichern 
        console.log("NewMedComponent: ", ev.target.value);
        this.searchbar = ev.target;
        // set val to the value of the searchbar
        let val = ev.target.value;
        // ist der Such-String gefüllt, länger als 3 Zeichen, kürzer als 8 Zeichen
        if (val && val.trim() != '' && val.length > 3 && val.length < 8) {
            // die Suche ausführen 
            let test = this.medService.searchMedFromServer(val);
            // auf die asynchrone Antwort reagieren
            test.subscribe();
            // das Ergebnis der Suche aus dem Service holen
            this.items = this.medService.getSuchtrefferListe();
            console.log("Suchergebnis ", ev.target.value, this.items);
            //            this.items = this.items.filter((item) => {
            //                return (item.getname().toLowerCase().indexOf(val.toLowerCase()) > -1);
            //            })
        }
        else {
            this.medService.clearSuchtrefferListe();
            this.items = new Array<Suchtreffer>();

        }
    }

    clickItemSelected(item: Suchtreffer) {
        //        console.log("Item selected:", item);
        let x = this.items.indexOf(item);
        // holt die Medikamenten-Daten vom Server - synchron
        console.log("clickItemSelected ", item.getidmedikament());
        let test: Promise<any> = this.medService.getMedikamentFromServer(item.getidmedikament());
        // wenn das Ergebnis eintrifft
        test.then(
            (response: Response) => {
                console.log("clickItemSelected: ", this.medService.getMed());
                this.navCtrl.push(MedPageComponent, { medid: item.getidmedikament(), bestandanzeigen: false });
//                this.navCtrl.pop();
            }
        )

    }

}

