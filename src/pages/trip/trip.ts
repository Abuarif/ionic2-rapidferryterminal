import { FerryRoute } from './../../models/ferryroute';
import { Output } from './../../models/output';
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
  output : Output;
  submitLabel: string = "Submit";

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
    this.isFull = this.timetable.FerryRoute.isFull;
    this.isOnTime = this.timetable.FerryRoute.isOnTime;
    this.color_isFull = this.timetable.FerryRoute.color_isFull;
    this.color_isOnTime = this.timetable.FerryRoute.color_isOnTime;

    console.log(this.timetable);

    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }

    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }
    this.update_time_depart();
    console.log(this.time_depart);
    console.log(this.timetable);
  }

  update_time_depart() {
    let myTime = '';
    if (this.location == 'PRTU') {
      myTime = this.datePipe.transform(this.service_date, 'yyyy-MM-dd') + 'T' + this.timetable.FerryRoute.departure_b + ':00';
    } else if (this.location == 'PSAH') {
      myTime = this.datePipe.transform(this.service_date, 'yyyy-MM-dd') + 'T' + this.timetable.FerryRoute.departure_a + ':00';
    }
      this.time_depart = myTime;
  }
  public updateTrip() {

    let location = this.location;
    let route_id = this.route_id;
    let route_timetable_id = this.route_timetable_id;
    let service_date = this.service_date;
    let isOnTime = 0;
    let isFull = 0;
    let time_depart = this.time_depart;
    if (this.isFull) {
      isFull = 1;
    } 

    if (this.isOnTime) {
      isOnTime = 1;
    } 

    this.setFerryTrip(location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart);
  }

  private setFerryTrip(location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart) {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    this.api.set_ferrytrip(location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart)
      .then((result) => {
        this.output = <Output> result;
        loading.dismiss();
        console.log(result);
        if (this.output.result == 'ok') {
          this.acknowledge(this.output.message);
          this.submitLabel = 'Resubmit';
        } else {
          this.acknowledge(this.output.message);
        }
      }, (err) => {
        loading.dismiss();
        console.log(err);
      });
  }

  changeFullColor() {
    if (this.isFull) {
      this.color_isFull = 'danger';
    } else {
      this.color_isFull = 'secondary';
    }
    // this.updateTrip();
  }

  changeOntimeColor() {

    if (this.isOnTime) {
      this.color_isOnTime = 'secondary';
      this.update_time_depart();
    } else {
      this.color_isOnTime = 'danger';
      this.time_depart = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd HH:mm')
    }
    // this.updateTrip();
  }

  acknowledge(message) {
    let alert = this.alertCtrl.create({
      title: 'Submission Notification!',
      message: message,
      buttons: [
        {
          text: 'Dismiss',
          handler: data => {
            console.log('Cancel clicked');
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }
}
