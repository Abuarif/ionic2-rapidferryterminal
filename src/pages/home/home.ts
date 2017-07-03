import { Route } from './../../models/busroutes';
import { DataApi } from './../../providers/data-api';
import { Ferrytrips } from './../../models/ferrytrips';
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Promotions } from "../../models/promotions";
import { Api } from "../../providers/api";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  full: boolean = false;
  color_boarding: string = 'dark';
  ontime: boolean = false;
  color_departure: string = 'dark';
  slides: Promotions[] = new Array();
  timetables: Ferrytrips[] = new Array();
  location: string;
  service_date: string;
  time_depart: string;

  constructor(
    public _loadingController: LoadingController,
    private api: Api,
    private alertCtrl: AlertController,
    private platform: Platform,
    private navCtrl: NavController,
    private dataApi: DataApi) { }

  ionViewWillEnter() {
    this.location = this.dataApi.get('location');
    this.service_date = this.dataApi.get('service_date');
    this.getFerryTimetables();
    console.log(this.location);
  }

  private getFerryTimetables() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    this.api.get_ferrytrips()
      .then((result) => {
        loading.dismiss();
        this.timetables = <Ferrytrips[]>result;
        console.log(this.timetables);
      }, (err) => {
        loading.dismiss();
        this.presentConfirm();
      });
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'No Internet Connection!',
      message: 'Please ensure your mobile is connected to internet. See you soon.',
      buttons: [
        {
          text: 'Close',
          handler: () => {
            this.exitApp();
          }
        }
      ]
    });
    alert.present();
  }

  private exitApp() {
    this.platform.exitApp();
  }

  public updateTrip(timetable: any) {
    console.log(timetable);
    console.log(this.full);
    console.log(this.ontime);
    let location = this.location;
    let route_id = timetable.Route.id;
    let route_timetable_id = timetable.RouteTimetable.id;
    let service_date = this.service_date;
    let isOnTime = this.ontime;
    let isAvailable = this.full;

    this.setFerryTrip(location, route_id, route_timetable_id, service_date, isOnTime, isAvailable, this.time_depart);
  }

  changeFullColor() {
    if (this.full) {
      this.color_boarding = 'danger';
    } else {
      this.color_boarding = 'dark';
    }
  }

  changeOntimeColor() {
    if (this.ontime) {
      this.color_departure = 'secondary';
    } else {
      this.color_departure = 'dark';
    }
    this.time_depart = new Date().toISOString();
  }

  private setFerryTrip(location, route_id, route_timetable_id, service_date, isOnTime, isAvailable, time_depart) {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();  

    this.api.set_ferrytrip(location, route_id, route_timetable_id, service_date, isOnTime, isAvailable, time_depart)
      .then((result) => {
        loading.dismiss();
        // this.timetables = <Ferrytrips[]>result;
        console.log(this.timetables);
      }, (err) => {
        loading.dismiss();
        this.presentConfirm();
      });
  }

  
}

