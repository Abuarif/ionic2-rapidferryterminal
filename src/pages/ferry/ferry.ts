import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-ferry',
  templateUrl: 'ferry.html',
})
export class Ferry {
  timetables: any = [];
  constructor(public navCtrl: NavController) {
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

}
