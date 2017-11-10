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
  public ferry_ops: any;
  public ferries: any;
  public users: any;
  public ops = { a: '', b: '', c: '', d: '', e: '', f: '' };

  current_date: string = new Date().toISOString();

  service_date: string = new Date().toISOString();
  constructor(
    public dataApi: DataApi,
    private api: Api,
    public alertCtrl: AlertController,
    public _loadingController: LoadingController) {
  }

  ionViewDidEnter() {
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }
    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }
    if (this.dataApi.get('ferry_ops')) {
      this.ferry_ops = this.dataApi.getFerryOps();
    }
    this.getFerry();
  }

  ionViewWillLeave() {
    this.dataApi.update('location', this.location);
    this.dataApi.update('service_date', this.service_date);
    this.dataApi.setFerryOps(this.ferry_ops);

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

  public get_ferry_ops() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 2000
    });

    loading.present();

    this.api.get_ferry_ops(this.service_date)
      .then((data) => {
        loading.dismiss();
        this.ferry_ops = data;
        this.parseFerryOps();
        console.log(this.ferry_ops)
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

  parseFerryOps() {
    this.ferry_ops.forEach(element => {
      if (element.FerryOpView.order == '0') {
        element.FerryOpView.order = 'A'
      } else if (element.FerryOpView.order == '1') {
        element.FerryOpView.order = 'B'
      } else if (element.FerryOpView.order == '2') {
        element.FerryOpView.order = 'C'
      } else if (element.FerryOpView.order == '3') {
        element.FerryOpView.order = 'D'
      } else if (element.FerryOpView.order == '4') {
        element.FerryOpView.order = 'E'
      } else if (element.FerryOpView.order == '5') {
        element.FerryOpView.order = 'F'
      }
    });
  }

  public refresh_ferryops() {
    this.get_ferry_ops();
    this.dataApi.setFerryOps(this.ferry_ops);
  }

  public save_ferryops() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });
    loading.present();
    this.api.set_ferry_ops(this.service_date, this.ops.a, this.ops.b, this.ops.c, this.ops.d, this.ops.e, this.ops.f)
      .then((data) => {
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
      });
  }

  private getFerry() {
    this.api.get_ferry()
      .then((result) => {
        this.ferries = result;
        console.log(this.ferries);
      }, (err) => {
      });
  }

  public allow_set_ferryops() {
    let status: boolean = false;
    let today = new Date(this.current_date);
    let systDate = new Date(this.service_date);
    if (systDate.getDate() > today.getDate()) {
      status = true;
    }
    return status;
  }
}
