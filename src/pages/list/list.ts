import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventEmitter, Output, ContentChild, Input } from '@angular/core';
import { MedService } from '../../app/med.service';
import { MedList } from '../../app/medlist.model';
import { MedKlein } from '../../app/medklein.model';
import { ListElementComponent } from './list-element/list-element.component';
import { MedPageComponent } from './med-page/med-page.component';
// import { NewSearchComponent } from './new/newsearch-component';
import { NewMedComponent } from './new/new-med/new-med.component';
import { MedNeu } from '../../app/medneu.model'
import { SearchComponent } from "./search/search.component";
import { FilterComponent } from "./filter/filter.component";
import { Filter } from "../../app/filter.model";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

/**
 * enthält die Liste der Medikamente im Bestand des Users
 * die Liste wird gefiltert, sortiert, kategorisiert 
 * Ein Eintrag kann selektiert werden, das öffnet die Medikamenten-Details-Seite
 */
export class ListPage implements OnInit {
  medList: MedKlein[];   // wird in der UI verwendet 
  filter: Filter;
  @Input() filterschmerz: boolean;
  @Input() kategorienAnzeigen: boolean = true;
  @Input() sortierung: string = "name";

  constructor(private navCtrl: NavController, private medService: MedService) {
    //    this.medList = this.medService.getMedList();
    this.filter = new Filter();
  }
  
  /**
   * asynchroner Eingang der Daten des Servers 
   * findet statt zu Beginn und bei jeder Änderung  
   * @param newList die neuen Daten der MedList
   */
  private medListChanged(newList: MedKlein[]) {
    console.log("List.ts medListChanged: eine neue Liste");
    this.medList = newList;
  }

  /**
   * zu Beginn wird die Liste mit den Daten vom Server geladen
   * asynchroner Service-Aufruf  
   */
  ngOnInit() {
    let test: Promise<any> = this.medService.getMedListFromServer2();
    this.medService.getMedList2().subscribe((value) => {
        this.medListChanged(value);
      });
    test.then(
      (response: Response) => {
        this.medList = this.medService.getMedList();
        console.log("List:ngOnInit: medService aufgerufen");
        this.medService.sortiereMedList("name");
        this.filter = this.medService.getFilter();
        // hier erfolgt die Aktualisierung der Liste 

//        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      }
    )
    // Registrierung für jede Änderung von Daten in der MedList
    this.medService.getMedList2().subscribe((value) => this.medListChanged(value));

  }

  /**
   * ein Element der Liste wird ausgewählt
   * die vollständigen Medikamnten - und Bestandsdaten werden vom Server geholt
   * wenn die Daten vom Server eingegangen sind, wird die Seite Med-Page geöffnet. 
   * @param item das selektierte Listen-Element
   */
  clickItemSelected(item: MedKlein) {
    // mit der ID des Bestandselementes wird Medikament und Bestand geholt.
    console.log("List:clickItemselected: " , item); 
    let test: Promise<any> = this.medService.getMedikamentBestandFromServer(item.getidbestand());
    test.then(
      (response: Response) => {
        this.navCtrl.push(MedPageComponent, { medid: item.getidbestand(), bestandanzeigen: true });
      }
    )
  }

  clickNewMed() {
    this.navCtrl.push(NewMedComponent);

  }

  getMedList(): MedKlein[] {
    return this.medList;
  }

  getMedListKategorie(kategorie: number): MedKlein[] {
    let x = this.medList.filter((item) => {
      return (item.getkategorie() == kategorie);
    })
    return x;
  }

  clickSearchMed() {
    this.navCtrl.push(SearchComponent);
  }

  clickFilter() {
    this.navCtrl.push(FilterComponent);
  }

  sortierungChange() {
    this.medService.sortiereMedList(this.sortierung);
  }

}
