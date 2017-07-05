import { Trip } from './../trip/trip';
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
  color_boarding: string = 'dark';
  color_departure: string = 'dark';
  slides: Promotions[] = new Array();
  timetables: Ferrytrips[] = new Array();
  location: string;
  service_date: string = new Date().toISOString();
  time_depart: string;
  submission_color: string;
  submission_label: string;
  is_ontime: boolean;
  is_full: boolean;

  constructor(
    public _loadingController: LoadingController,
    private api: Api,
    private alertCtrl: AlertController,
    private platform: Platform,
    private navCtrl: NavController,
    private dataApi: DataApi) { }

  ionViewWillEnter() {
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }

    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    } 
    this.getFerryTimetables();

    console.log(this.timetables);
    console.log(this.location);
  }

  private getFerryTimetables() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    this.api.get_ferrytrips(this.location)
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
    console.log(timetable.RouteTimetable.is_full);
    console.log(timetable.RouteTimetable.is_ontime);
    let location = this.location;
    let route_id = timetable.Route.id;
    let route_timetable_id = timetable.RouteTimetable.id;
    let service_date = this.service_date;
    let isOnTime = timetable.RouteTrip.is_ontime;
    let isAvailable = timetable.RouteTrip.is_full;
    let time_depart = timetable.RouteTrip.time_depart;

    this.setFerryTrip(location, route_id, route_timetable_id, service_date, isOnTime, isAvailable, time_depart);
  }

  changeFullColor(trip) {
    if (this.is_full) {
      trip.RouteTrip.color_full = 'danger';
    } else {
      trip.RouteTrip.color_full = 'dark';
    }
  }

  changeOntimeColor(trip) {
    if (this.is_ontime) {
      trip.RouteTrip.color_ontime = 'secondary';
    } else {
      trip.RouteTrip.color_ontime = 'dark';
    }

    trip.RouteTrip.time_depart = new Date().toISOString();
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
        this.getFerryTimetables();
      }, (err) => {
        loading.dismiss();
        this.presentConfirm();
      });
  }

  public allowSubmission(timetable) {

    if (timetable.RouteTrip.length == 0) {
      console.log('new');
      this.submission_color = 'secondary';
      this.submission_label = 'Submit Now';
      return true;
    } else if (timetable.RouteTrip.length > 0) {
      // check for location
      for (let trip of timetable.RouteTrip) {
        if (trip.location_id == 1 && this.location == 'PSAH' && trip.status == true) {
          console.log('submitted PSAH');
          this.submission_color = 'light';
          this.submission_label = 'Submitted';
          return true;
        } else if (trip.location_id == 2 && this.location == 'PRTU' && trip.status == true) {
          console.log('submitted PRTU');
          this.submission_color = 'light';
          this.submission_label = 'Submitted';
          return true;
        } else {
          console.log('new');
          this.submission_color = 'secondary';
          this.submission_label = 'Submit Now';
          return false;
        }
      }
    }
  }

  public getDetail(timetable) {
    this.navCtrl.push(Trip, {trip: timetable});
  }
}

