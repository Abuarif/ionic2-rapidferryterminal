import { DatePipe } from '@angular/common';
import { Api } from './../../providers/api';
import { DataApi } from './../../providers/data-api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html',
})
export class Trip {
  timetable: any;
  location: string;
  service_date: string = new Date().toISOString();
  isOnTime: boolean = true;
  isFull: boolean = false;
  color_isFull: string;
  color_isOnTime: string;
  time_depart: string;
  route_id: string;
  route_timetable_id: string;
  location_id: string;

  constructor(
    public _loadingController: LoadingController,
    private api: Api,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    public NavParams: NavParams,
    private dataApi: DataApi,
    private datePipe: DatePipe) {
  }

  ionViewWillEnter() {
    this.timetable = this.NavParams.get('trip');
    this.route_id = this.timetable.FerryRoute.id;
    this.route_timetable_id = this.timetable.FerryRoute.route_timetable_id;
    this.location_id = this.timetable.FerryRoute.location_id;

    console.log(this.timetable);

    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }

    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }
    this.update_time_depart();
    console.log(this.time_depart);
  }

  update_time_depart() {
    if (this.location == 'PSTU') {
      this.time_depart = this.datePipe.transform(this.service_date, 'yyyy-MM-dd') + ' ' + this.timetable.FerryRoute.departure_b;
    } else if (this.location == 'PSAH') {
      this.time_depart = this.datePipe.transform(this.service_date, 'yyyy-MM-dd') + ' ' + this.timetable.FerryRoute.departure_a;
    }
  }
  public updateTrip() {

    let location = this.location;
    let route_id = this.route_id;
    let route_timetable_id = this.route_timetable_id;
    let service_date = this.service_date;
    let isOnTime = this.isOnTime;
    let isFull = this.isFull;
    let time_depart = this.time_depart;

    this.setFerryTrip(location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart);
    console.log(location);
    console.log(route_id);
    console.log(route_timetable_id);
    console.log(service_date);
    console.log(isOnTime);
    console.log(isFull);
    console.log(time_depart);
  }

  private setFerryTrip(location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart) {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    this.api.set_ferrytrip(location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart)
      .then((result) => {
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
      });
  }

  changeFullColor() {
    if (this.isFull) {
      this.color_isFull = 'danger';
    } else {
      this.color_isFull = 'secondary';
    }
    this.updateTrip();
  }

  changeOntimeColor() {

    if (this.isOnTime) {
      this.color_isOnTime = 'secondary';
      this.update_time_depart();
    } else {
      this.color_isOnTime = 'danger';
      this.time_depart = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd HH:mm')
    }
    this.updateTrip();
  }
}
