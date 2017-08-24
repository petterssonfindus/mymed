import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { MedService } from "../../app/med.service";
import { HttpUserService } from "../../app/user.service";
import { Observable } from "rxjs/Observable";
import { URLSearchParams } from "@angular/http";
import { Med } from "../../app/med.model";

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  heroes: string[];
  med : Med;

  constructor(public navCtrl: NavController, private medService: MedService) {
    this.heroes = ['hero 1', 'hero 2', 'hero 3'];
  }

  clickAddHero() {

    let errMsg : string;

    this.medService.getMedListFromServer2().then();

  }

  clickDeleteHero() {
    
  }
}
