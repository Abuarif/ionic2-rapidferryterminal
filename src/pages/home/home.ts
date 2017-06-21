import { DataApi } from './../../providers/data-api';
import { Ferrytrips, RouteTimetable } from './../../models/ferrytrips';
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Promotions } from "../../models/promotions";
import { Api } from "../../providers/api";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  slides: Promotions[] = new Array();
  timetables: Ferrytrips[] = new Array();
  location: string;

  constructor(
    public _loadingController: LoadingController, 
    private api: Api, 
    private alertCtrl: AlertController, 
    private platform: Platform, 
    private navCtrl: NavController, 
    private dataApi: DataApi) { }

  ionViewWillEnter() {
    this.location = this.dataApi.get('location');
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

  public updateTrip(timetable: RouteTimetable) {
    console.log(timetable);
  }
}
