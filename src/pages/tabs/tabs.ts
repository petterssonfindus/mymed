import { Component } from '@angular/core';

import { ListPage } from '../list/list';
import { InfoPage } from '../info/info';
import { EinstellungenPage } from '../einstellungen/einstellungen';
import { MedService } from '../../app/med.service'

@Component({
  templateUrl: 'tabs.html',
  providers: [MedService]
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ListPage;
  tab2Root: any = InfoPage;
  tab3Root: any = EinstellungenPage;

  constructor() {

  }
}
