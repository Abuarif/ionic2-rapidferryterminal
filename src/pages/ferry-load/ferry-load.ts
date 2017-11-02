import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FerryLoadPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ferry-load',
  templateUrl: 'ferry-load.html',
})
export class FerryLoadPage {
  load = {
    location: 0,
    lorry: 0,
    car: 0,
    motorcycle: 0,
    bicycle: 0,
    pedestarian: 0
  }
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter FerryLoadPage');
    this.load.location = this.navParams.get('location')
  }

  
}
