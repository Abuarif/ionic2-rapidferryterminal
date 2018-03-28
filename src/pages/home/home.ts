import { LoginPage } from './../login/login';
import { DatePipe } from '@angular/common';
import { Settings } from './../settings/settings';
import { Trip } from './../trip/trip';
import { DataApi } from './../../providers/data-api';
import { Ferrytrips } from './../../models/ferrytrips';
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Promotions } from "../../models/promotions";
import { Api } from "../../providers/api";
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  color_boarding: string = 'dark';
  color_departure: string = 'dark';
  slides: Promotions[] = new Array();
  timetables: any = new Array();
  // timetables: Ferrytrips[] = new Array();
  location: string;
  service_date: string = new Date().toISOString();
  time_depart: string;
  submission_color: string;
  submission_label: string;
  is_ontime: boolean;
  is_full: boolean;
  public checkInternetMsg = '';

  constructor(
    public _loadingController: LoadingController,
    private api: Api,
    private alertCtrl: AlertController,
    private platform: Platform,
    private navCtrl: NavController,
    private dataApi: DataApi,
    private datePipe: DatePipe,
    public authService: AuthServiceProvider
  ) { }

  ionViewWillEnter() {
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }

    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }

    if (!this.authService.authenticated()) {
      this.navCtrl.push(LoginPage);
    } else {
      this.getFerryTimetables();
    }

  }

  private getFerryTimetables() {

    let service_date = this.datePipe.transform(this.service_date, 'yyyy-MM-dd');
    this.api.get_ferryroutes(this.location, service_date)
      .then((result) => {
        this.timetables = result;
        this.parseTrip();
        console.log(this.timetables);
        this.checkInternetMsg = '';
      }, (err) => {
        this.timetables = Array();
        this.checkInternetMsg = 'Data not found. Please check your internet! If the service persist, contact your IT Admin';
      });
    console.log(this.service_date)
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    let service_date = this.datePipe.transform(this.service_date, 'yyyy-MM-dd');

    setTimeout(() => {
      console.log('Async operation has ended');
      this.api.get_ferryroutes(this.location, service_date)
        .then((result) => {
          this.timetables = <Ferrytrips[]>result;
          console.log(this.timetables);
          this.parseTrip();
        }, (err) => {
        });
      refresher.complete();
    }, 2000);
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

  private exitApp() {
    this.platform.exitApp();
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
    this.navCtrl.push(Trip, { trip: timetable, 'requestfrom': 'home' });
  }

  private parseTrip() {
    this.timetables.forEach(element => {

      // let service_date = this.datePipe.transform(this.service_date, 'yyyy-MM-dd');

      // element.FerryRoute.boarding_a = service_date + 'T' + element.FerryRoute.boarding_a + ':00.000+08:00'
      // element.FerryRoute.boarding_b = service_date + 'T' + element.FerryRoute.boarding_b + ':00.000+08:00'
      // element.FerryRoute.departure_a = service_date + 'T' + element.FerryRoute.departure_a + ':00.000+08:00'
      // element.FerryRoute.departure_b = service_date + 'T' + element.FerryRoute.departure_b + ':00.000+08:00'

      element.FerryRoute.boarding_a = this.is_next_day(element.FerryRoute.boarding_a)
      element.FerryRoute.boarding_b = this.is_next_day(element.FerryRoute.boarding_b)
      element.FerryRoute.departure_a = this.is_next_day(element.FerryRoute.departure_a)
      element.FerryRoute.departure_b = this.is_next_day(element.FerryRoute.departure_b)

      if (element.FerryRoute.time_depart != '') {
        element.FerryRoute.time_depart = new Date(element.FerryRoute.time_depart).toUTCString();
      }
    });
  }

  private is_next_day(element_entry) {
    let day = 0;
    let parts = element_entry.split(':');
    let hour = '00'
    if (parseInt(parts[0], 10) == 24) {
      hour = '00';
      day = 1;
    } else if (parseInt(parts[0], 10) > 24) {
      let new_hour = parseInt(parts[0], 10) - 24
      if (new_hour < 10) {
        hour = '0' + new_hour;
      } else {
        hour = new_hour.toString();
      }
      day = 1;
    } else {
      hour = parts[0]
    }

    let todayDate = new Date();
    let service_date = this.datePipe.transform(new Date().setDate(todayDate.getDate() + day), 'yyyy-MM-dd');
    element_entry = service_date + 'T' + hour + ':' + parts[1] + ':00.000+08:00';
    return element_entry

  }
}


