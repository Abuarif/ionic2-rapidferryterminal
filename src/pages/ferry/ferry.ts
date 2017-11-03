import { DatePipe } from '@angular/common';
import { Settings } from './../settings/settings';
import { Trip } from './../trip/trip';
import { DataApi } from './../../providers/data-api';
// import { Ferrytrips } from './../../models/ferrytrips';
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Promotions } from "../../models/promotions";
import { Api } from "../../providers/api";

@Component({
  selector: 'page-ferry',
  templateUrl: 'ferry.html'
})
export class Ferry {
  color_boarding: string = 'dark';
  color_departure: string = 'dark';
  slides: Promotions[] = new Array();
  // timetables: Ferrytrips[] = new Array();  
  timetables: any = new Array();

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
    private dataApi: DataApi,
    private datePipe: DatePipe
  ) { }

  ionViewWillEnter() {
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }

    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }

    this.getHistory();
  }

  private getHistory() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    if (this.datePipe.transform(this.service_date, 'dd-MM-yyyy') !=
      this.datePipe.transform(new Date().toISOString(), 'dd-MM-yyyy')) {
      this.checkServiceDate();
    }

    this.api.get_history(this.location)
      .then((result) => {
        loading.dismiss();
        // this.timetables = <Ferrytrips[]>result;
        this.timetables = result;
        console.log(this.timetables);
        this.parseTrip();
      }, (err) => {
        loading.dismiss();
        // this.presentConfirm();
      });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.api.get_ferryroutes(this.location)
        .then((result) => {
          // this.timetables = <Ferrytrips[]>result;
          this.timetables = result;
          this.parseTrip();
          console.log(this.timetables);
        }, (err) => {
        });
      refresher.complete();
    }, 2000);
  }

  checkServiceDate() {
    let alert = this.alertCtrl.create({
      title: 'Service Date Verification!',
      message: 'Your current service date is not updated (' +
      this.datePipe.transform(this.service_date, 'dd-MMM-yyyy') +
      '). <br/><br/>Click <b>Change</b> to proceed.',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: data => {
            this.navCtrl.push(Settings);
          }
        }
      ]
    });
    alert.present();
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
    this.navCtrl.push(Trip, { trip: timetable, 'requestfrom':'history' });
  }

  private parseTrip() {
    this.timetables.forEach(element => {
      let service_date = this.datePipe.transform(this.service_date, 'yyyy-MM-dd');
      if (element.FerryRoute.boarding_a == 'Tamat'|| element.FerryRoute.boarding_a == '') {
        element.FerryRoute.boarding_a = '23:59'
      }
      if (element.FerryRoute.boarding_b == 'Tamat'|| element.FerryRoute.boarding_b == '') {
        element.FerryRoute.boarding_b = '23:59'
      }
      if (element.FerryRoute.departure_a == 'Tamat'|| element.FerryRoute.departure_a == '') {
        element.FerryRoute.departure_a = '23:59'
      }
      if (element.FerryRoute.departure_b == 'Tamat'|| element.FerryRoute.departure_b == '') {
        element.FerryRoute.departure_b = '23:59'
      }
      element.FerryRoute.boarding_a = service_date + 'T' + element.FerryRoute.boarding_a + ':00.000+08:00'
      element.FerryRoute.boarding_b = service_date + 'T' + element.FerryRoute.boarding_b + ':00.000+08:00'
      element.FerryRoute.departure_a = service_date + 'T' + element.FerryRoute.departure_a + ':00.000+08:00'
      element.FerryRoute.departure_b = service_date + 'T' + element.FerryRoute.departure_b + ':00.000+08:00'
    });
  }
}

