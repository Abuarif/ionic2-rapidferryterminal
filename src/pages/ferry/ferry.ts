import { DataApi } from './../../providers/data-api';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-ferry',
  templateUrl: 'ferry.html',
})
export class Ferry {
  location: any;
  timetables: any = [];
  constructor(
    public navCtrl: NavController, 
    private dataApi: DataApi
  ) {
    this.location = this.dataApi.get('location');
    this.timetables = [
      {
        boarding: '7.00 am',
        on_time: true,
        full: true,
        departure: '7.20 am',
        ets: true,
        bus: true,
      },
      {
        boarding: '8.00 am',
        on_time: false,
        full: true,
        departure: '8.20 am',
        ets: true,
        bus: true,
      },
      {
        boarding: '9.00 am',
        on_time: true,
        full: false,
        departure: '9.20 am',
        ets: true,
        bus: true,
      },
      {
        boarding: '10.00 am',
        on_time: true,
        full: false,
        departure: '10.20 am',
        ets: true,
        bus: true,
      },
      {
        boarding: '11.00 am',
        on_time: true,
        full: false,
        departure: '11.20 am',
        ets: true,
        bus: true,
      },
    ];
  }

  ionViewWillEnter() {
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    } else {
      this.location = 'PRTU';
      this.dataApi.update('location', this.location);
    }
    console.log(this.location);
  }

}
