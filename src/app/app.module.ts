import { NgModule, ErrorHandler } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { InfoPage } from '../pages/info/info';
import { EinstellungenPage } from '../pages/einstellungen/einstellungen';
import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs/tabs';
// import { NewComponent } from '../pages/list/new/new-component';
import { NewSearchComponent } from '../pages/list/new/newsearch.component';
import { NewMedComponent } from '../pages/list/new/new-med/new-med.component';

import { ListElementComponent } from '../pages/list/list-element/list-element.component';
import { MedPageComponent } from '../pages/list/med-page/med-page.component';
import { BestandComponent } from '../pages/list/bestand/bestand.component';
import { MedService } from './med.service';
import { MedDetailComponent } from '../pages/list/med-detail/med-detail.component';
import { SearchComponent } from "../pages/list/search/search.component";
import { FilterComponent } from "../pages/list/filter/filter.component";


@NgModule({
  declarations: [
    MyApp,
    InfoPage,
    EinstellungenPage,
    ListPage,
    TabsPage,
//     NewComponent,
    NewSearchComponent,
    NewMedComponent,
    ListElementComponent,
    MedPageComponent,
    BestandComponent,
    MedDetailComponent,
    SearchComponent, 
    FilterComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule
  ],
  bootstrap: [IonicApp],

  entryComponents: [
    MyApp,
    InfoPage,
    EinstellungenPage,
    ListPage,
    TabsPage,
    ListElementComponent,
    NewMedComponent,
//     NewComponent,
    NewSearchComponent,
    MedPageComponent, 
    BestandComponent, 
    MedDetailComponent,
    SearchComponent, 
    FilterComponent
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
