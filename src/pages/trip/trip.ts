import { FerryLoadPage } from './../ferry-load/ferry-load';
// import { FerryRoute } from './../../models/ferryroute';
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
  public new_ferry: string;
  public delaytime: string;
  timetable: any;
  location: string;
  loading: string;

  service_date: string = new Date().toISOString();
  // isOnTime: boolean = true;
  isDelay: boolean = false;
  isFull: boolean = false;
  color_isFull: string;
  color_isOnTime: string;
  time_depart: string;
  public departure_time: string;
  public delayed_departure: string;
  route_id: string;
  route_timetable_id: string;
  location_id: string;
  output: Output;
  submitLabel: string = "Update Trip";
  public isCancel: boolean = false;
  public lorry: number = 0;
  public car: number = 0;
  public motorcycle: number = 0;
  public bicycle: number = 0;
  public pedestarian: number = 0;
  public requestfrom: string;
  public isAllow: boolean = false;
  public isDisabled: boolean = false;
  public actual_ferry: string;
  public ferries: any;

  constructor(
    public _loadingController: LoadingController,
    private api: Api,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    public NavParams: NavParams,
    private dataApi: DataApi,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.requestfrom = this.NavParams.get('requestfrom');
    this.timetable = this.NavParams.get('trip');

    this.route_id = this.timetable.FerryRoute.id;
    this.route_timetable_id = this.timetable.FerryRoute.route_timetable_id;
    this.location_id = this.timetable.FerryRoute.location_id;
    this.isFull = this.timetable.FerryRoute.isFull;
    this.isDelay = !this.timetable.FerryRoute.isOnTime;
    this.color_isFull = this.timetable.FerryRoute.color_isFull;
    this.color_isOnTime = this.timetable.FerryRoute.color_isOnTime;
    this.time_depart = this.timetable.FerryRoute.time_depart;

    console.log(this.timetable);
    this.reset_data();

    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }

    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }
    this.update_time_depart();
    console.log(this.time_depart);
    console.log(this.timetable);
    setInterval(
      () => {
        this.update_time_depart();
      }, 5000 // refresh to check new data for every 5 seconds.
    )
  }

  ionViewDidEnter() {
    this.getFerry();
    if (this.timetable.FerryRoute.actual_ferry) {
      this.actual_ferry = this.timetable.FerryRoute.actual_ferry
    }
    if (this.timetable.FerryRoute.isCancelled) {
      this.isCancel = this.timetable.FerryRoute.isCancelled
    }
    if (this.timetable.FerryRoute.lorry) {
      this.lorry = this.timetable.FerryRoute.lorry
    }
    if (this.dataApi.maindeck.lorry || this.dataApi.upperdeck.lorry) {
      this.lorry = +this.dataApi.maindeck.lorry + +this.dataApi.upperdeck.lorry;
    }
    if (this.timetable.FerryRoute.car) {
      this.car = this.timetable.FerryRoute.car
    }
    if (this.dataApi.maindeck.car || this.dataApi.upperdeck.car) {
      this.car = +this.dataApi.maindeck.car + +this.dataApi.upperdeck.car;
    }
    if (this.timetable.FerryRoute.motorcycle) {
      this.motorcycle = this.timetable.FerryRoute.motorcycle
    }
    if (this.dataApi.maindeck.motorcycle || this.dataApi.upperdeck.motorcycle) {
      this.motorcycle = +this.dataApi.maindeck.motorcycle + +this.dataApi.upperdeck.motorcycle;
    }
    if (this.timetable.FerryRoute.bicycle) {
      this.bicycle = this.timetable.FerryRoute.bicycle
    }
    if (this.dataApi.maindeck.bicycle || this.dataApi.upperdeck.bicycle) {
      this.bicycle = +this.dataApi.maindeck.bicycle + +this.dataApi.upperdeck.bicycle;
    }
    if (this.timetable.FerryRoute.pedestarian) {
      this.pedestarian = this.timetable.FerryRoute.pedestarian
    }
    if (this.dataApi.maindeck.pedestarian || this.dataApi.upperdeck.pedestarian) {
      this.pedestarian = +this.dataApi.maindeck.pedestarian + +this.dataApi.upperdeck.pedestarian;
    }

    if (this.requestfrom == 'history') {
      this.isAllow = true;
      this.isDisabled = true;
    } else {
      this.isAllow = false;
      this.isDisabled = false;
    }

    if (this.location == 'PSAH') {
      this.departure_time = this.timetable.FerryRoute.departure_a
    } else {
      this.departure_time = this.timetable.FerryRoute.departure_b
    }
    if (this.timetable.FerryRoute.delayed_departure) {
      this.delayed_departure = this.timetable.FerryRoute.delayed_departure
    } else {
      this.delayed_departure = this.departure_time;
    }

  }

  update_time_depart() {
    let myTime = '';
    if (this.location == 'PRTU') {
      myTime = this.timetable.FerryRoute.departure_b;
    } else if (this.location == 'PSAH') {
      myTime = this.timetable.FerryRoute.departure_a;
    }
    console.log(myTime);
    if (!this.isDelay) {
      this.time_depart = myTime;
    }
  }

  public updateTrip(page) {
    let isOnTime = 0;
    let isFull = 0;
    let isCancelled = 0;
    let submit = true;

    if (this.isFull) {
      isFull = 1;
    }
    if (!this.isDelay) {
      isOnTime = 1;
    }
    if (this.isCancel) {
      isCancelled = 1;
    }
    console.log('service: ' + this.service_date)
    console.log('delayed depart: ' + this.delayed_departure)
    console.log('Actual Ferry: ' + this.actual_ferry)

    let date1 = new Date(this.delayed_departure)
    let date2 = new Date(this.departure_time)
    if (page == 'home' && this.isDelay && !isCancelled && (date1.getTime() < date2.getTime() || date1.getTime() == date2.getTime())) {
      submit = false;
      this.showAlert();
    }

    if (submit) {
      this.setFerryTrip(page, this.location, this.route_id, this.route_timetable_id, this.service_date, isOnTime, isFull, this.time_depart, this.delayed_departure, isCancelled, this.actual_ferry, this.lorry, this.car, this.motorcycle, this.bicycle, this.pedestarian);
    }
  }

  private setFerryTrip(page, location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart, delayed_departure, isCancelled, actual_ferry, lorry, car, motorcycle, bicycle, pedestarian) {

    
    // console.log('Delayed: ' + delayed_departure);

    this.api.set_ferrytrip(page, location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart, delayed_departure, isCancelled, actual_ferry, lorry, car, motorcycle, bicycle, pedestarian)
      .then((result) => {
        this.output = <Output>result;
        if (this.output.result == 'ok') {
          this.submitLabel = 'Resubmit';
        }
        this.acknowledge(this.output.message);
      }, (err) => {
        // loading.dismiss();
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

    if (!this.isDelay) {
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

  public changeDelayStatus() {
    if (this.isCancel) {
      this.isDelay = true;
    } else {
      this.isDelay = false;
    }
  }

  public addLoading(location) {
    this.navCtrl.push(FerryLoadPage, { 'location': location.value })
  }

  reset_data() {
    this.dataApi.maindeck.lorry = 0;
    this.dataApi.maindeck.car = 0;
    this.dataApi.maindeck.motorcycle = 0;
    this.dataApi.maindeck.bicycle = 0;
    this.dataApi.maindeck.pedestarian = 0;


    this.dataApi.upperdeck.lorry = 0;
    this.dataApi.upperdeck.car = 0;
    this.dataApi.upperdeck.motorcycle = 0;
    this.dataApi.upperdeck.bicycle = 0;
    this.dataApi.upperdeck.pedestarian = 0;

  }

  private getFerry() {

    this.api.get_ferry()
      .then((result) => {
        this.ferries = result;
        console.log(this.ferries);
      }, (err) => {
      });
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Missing Information!',
      subTitle: 'Provide the Delayed Departure Time!',
      buttons: ['OK']
    });
    alert.present();
  }
}
