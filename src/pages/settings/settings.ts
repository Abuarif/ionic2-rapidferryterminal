import { DataApi } from './../../providers/data-api';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {
  location: string = 'PRTU';
  constructor(public dataApi: DataApi) {
  }

  ionViewWillEnter() {
    if (!this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }
  }

  ionViewWillLeave(){
    this.dataApi.update('location', this.location);
  }

}
