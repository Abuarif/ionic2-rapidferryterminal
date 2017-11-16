import { Output } from './../../models/output';
import { FerryOperation } from './../../models/ferryoperation';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { DatePipe } from '@angular/common';


@IonicPage()
@Component({
  selector: 'page-ferry-assignment',
  templateUrl: 'ferry-assignment.html',
})
export class FerryAssignmentPage {
  public ferry_orders: any;
  public ferries: any;
  public service_date: string;
  public ferry_operation: FerryOperation = new FerryOperation();
  output: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public api: ApiProvider,
    private datePipe: DatePipe
  ) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad FerryAssignmentPage');
    this.service_date = this.navParams.get('service_date');

    this.getFerry();
    this.getFerryOrder();
  }

  private getFerry() {
    this.api.get_ferry()
      .then((result) => {
        this.ferries = result;
      }, (err) => {
      });
  }


  private getFerryOrder() {
    this.api.get_ferry_order()
      .then((result) => {
        this.ferry_orders = result;
      }, (err) => {
      });
  }

  public add_ferryops() {
    this.ferry_operation.status = '1'; 
    this.ferry_operation.service_date = this.datePipe.transform(this.service_date, 'yyyy-MM-dd')
    
    this.api.add_ferry_op(this.ferry_operation.ferry_id, this.ferry_operation.ferry_order_id, this.ferry_operation.service_date)
      .then((data) => {
        this.output = data as Output;
        console.log('alalalala ' + this.output)
        if (this.output.result == 1) {
          this.navCtrl.pop();
        }
      }, (err) => {
      });
  }
}
