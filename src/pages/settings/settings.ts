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
  service_date: string = new Date().toISOString();
  constructor(public dataApi: DataApi) {
  }

  ionViewWillEnter() {
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }
    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }
  }

  ionViewWillLeave(){
    this.dataApi.update('location', this.location);
    this.dataApi.update('service_date', this.service_date);
  }
  
  displayServiceDate() {
    console.log(this.service_date);
  }
}
