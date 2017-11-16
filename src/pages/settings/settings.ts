import { Output } from './../../models/output';
import { DataApi } from './../../providers/data-api';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { LoginPage } from '../login/login';
import { FerryAssignmentPage } from '../ferry-assignment/ferry-assignment';
import { ApiProvider } from '../../providers/api/api';

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
  output: Output;
  current_date: string = new Date().toISOString();
  service_date: string = new Date().toISOString();
  public isActivated: boolean = false;

  constructor(
    public dataApi: DataApi,
    private api: ApiProvider,
    public alertCtrl: AlertController,
    public _loadingController: LoadingController,
    public authService: AuthServiceProvider,
    private navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController
  ) {
  }

  ionViewDidEnter() {
    if (this.dataApi.get('activate')) {
      this.isActivated = (this.dataApi.get('activate') == 'true');
    }
    if (this.dataApi.get('location')) {
      this.location = this.dataApi.get('location');
    }
    if (this.dataApi.get('service_date')) {
      this.service_date = this.dataApi.get('service_date');
    }
    if (this.dataApi.get('ferry_ops')) {
      this.ferry_ops = this.dataApi.getFerryOps();
    }

    if (!this.authService.authenticated()) {
      this.navCtrl.push(LoginPage);
    } else {
      this.getFerry();
      this.get_ferry_ops();
    }

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
        // this.parseFerryOps();
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
    this.api.set_ferry_ops(this.service_date, '', '', '', '', '', '')
      .then((data) => {
        this.output = <Output>data;
        loading.dismiss();
        this.acknowledge(this.output.message);
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

  acknowledge(message) {
    let alert = this.alertCtrl.create({
      title: 'Submission Notification!',
      message: message,
      buttons: [
        {
          text: 'Dismiss',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  public logout() {
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage)
  }

  public AdminSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Administrator Settings',
      buttons: [
        {
          text: 'Populate Data',
          role: 'populate',
          handler: () => {
            console.log('Populate clicked');
            this.populateConfirm();
          }
        }, {
          text: 'Delete Data',
          role: 'delete',
          handler: () => {
            console.log('Delete clicked');
            this.deleteConfirm();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public SignOutSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Sign Out',
      buttons: [
        {
          text: 'Confirm',
          role: 'confirm',
          handler: () => {
            console.log('SignOut clicked');
            this.authService.logout();
            // this.navCtrl.setRoot(LoginPage);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public add_ferry_op() {
    this.navCtrl.push(FerryAssignmentPage,
      {
        'ferry_ops': this.ferry_ops,
        'ferries': this.ferries,
        'service_date': this.service_date
      }
    );
  }

  public remove(ferry_operation_entry) {
    console.log('Remove: ' + ferry_operation_entry.FerryOperation.id)
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    this.api.delete_ferry_op(ferry_operation_entry.FerryOperation.id)
      .then((data) => {
        loading.dismiss();
        this.output = data as Output
        if (this.output.result == '1') {
          this.refresh_ferryops()
        }
      }, (err) => {
        loading.dismiss();
      });
  }

  public removeConfirmation(ferry_ops) {
    let alert = this.alertCtrl.create({
      title: 'Remove Ferry Assignment!',
      message: 'Are you sure you want to remove this data?',
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            console.log('Yes clicked');
            this.remove(ferry_ops)
          }
        },{
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    alert.present();
  }
}
