import { DataApi } from './../../providers/data-api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Trip page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html',
})
export class Trip {
  timetable: any;
  location: string;
  service_date: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataApi: DataApi) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Trip');
  }

  ionViewWillEnter() {
    this.timetable = this.navParams.get('trip');
    console.log(this.timetable);
    
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }

    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    } 

  }
}
