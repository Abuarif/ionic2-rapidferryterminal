import { Api } from './../../providers/api';
import { DataApi } from './../../providers/data-api';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {
  location: string = 'PRTU';
  private token: string = '';
  private email: string = '';
  private user_id: string = '';
  private name: string = '';
  private debug: boolean = false;
  private activate: boolean = false;
  
  service_date: string = new Date().toISOString();
  constructor(
    public dataApi: DataApi,
    private api: Api,
    public alertCtrl: AlertController,
    public _loadingController: LoadingController) {
  }

  ionViewWillEnter() {
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }
    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }
  }

  ionViewWillLeave() {
    this.dataApi.update('location', this.location);
    this.dataApi.update('service_date', this.service_date);
  }

  displayServiceDate() {
    console.log(this.service_date);
  }

  public populateTrip() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    this.api.populate_trip()
      .then((data) => {
        loading.dismiss();
        alert('Dismiss');
      }, (err) => {
        loading.dismiss();
      });
  }

  deleteConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete the trip data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.deleteTrip();
          }
        }
      ]
    });
    alert.present();
  }

  populateConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Populate',
      message: 'Do you want to populate the trip data?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.populateTrip();
          }
        }
      ]
    });
    alert.present();
  }

  public deleteTrip() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    this.api.delete_trip()
      .then((data) => {
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
      });
  }
}
