import { DataApi } from './../../providers/data-api';
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
    deck: 0,
    lorry: 0,
    car: 0,
    motorcycle: 0,
    bicycle: 0,
    pedestarian: 0
  }
  public title: string;
  public isMainDeck: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataApi: DataApi
  ) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter FerryLoadPage');
    this.load.deck = parseInt(this.navParams.get('location'));
    if (this.load.deck == 1) {
      this.isMainDeck = true;
      this.title = 'Main Deck';
      if (this.dataApi.maindeck.lorry != 0 ||
        this.dataApi.maindeck.car != 0 ||
        this.dataApi.maindeck.motorcycle != 0 ||
        this.dataApi.maindeck.bicycle != 0 ||
        this.dataApi.maindeck.pedestarian != 0
      ) {
        this.load.lorry = this.dataApi.maindeck.lorry
        this.load.car = this.dataApi.maindeck.car
        this.load.motorcycle = this.dataApi.maindeck.motorcycle
        this.load.bicycle = this.dataApi.maindeck.bicycle
        this.load.pedestarian = this.dataApi.maindeck.pedestarian
      }
    } else {
      this.title = 'Upper Deck';
      this.isMainDeck = false;
      if (this.dataApi.upperdeck.lorry != 0 ||
        this.dataApi.upperdeck.car != 0 ||
        this.dataApi.upperdeck.motorcycle != 0 ||
        this.dataApi.upperdeck.bicycle != 0 ||
        this.dataApi.upperdeck.pedestarian != 0
      ) {
        this.load.lorry = this.dataApi.upperdeck.lorry
        this.load.car = this.dataApi.upperdeck.car
        this.load.motorcycle = this.dataApi.upperdeck.motorcycle
        this.load.bicycle = this.dataApi.upperdeck.bicycle
        this.load.pedestarian = this.dataApi.upperdeck.pedestarian
      }
    }
  }

  public submit_ferry_load() {
    if (this.load.deck == 1) {
      this.dataApi.maindeck.lorry = this.load.lorry;
      this.dataApi.maindeck.car = this.load.car;
      this.dataApi.maindeck.motorcycle = this.load.motorcycle;
      this.dataApi.maindeck.bicycle = this.load.bicycle;
      this.dataApi.maindeck.pedestarian = this.load.pedestarian;
    } else {
      this.dataApi.upperdeck.lorry = this.load.lorry
      this.dataApi.upperdeck.car = this.load.car
      this.dataApi.upperdeck.motorcycle = this.load.motorcycle
      this.dataApi.upperdeck.bicycle = this.load.bicycle
      this.dataApi.upperdeck.pedestarian = this.load.pedestarian
    }
    this.navCtrl.pop();
  }
}
