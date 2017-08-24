import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-einstellungen',
  templateUrl: 'einstellungen.html'
})
export class EinstellungenPage {

  pfad: string;

  constructor(public navCtrl: NavController) {
    this.pfad = "http://localhost:8080/picture/img1.jpg";
  }

}
