import { FerryOps } from './../../models/ferrytrips';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class DataApiProvider {

  public data = {
    debug: '',
    serverPath: '',
    token: '0',
    location: '',
    user_id: '',
    email: '',
    name: '',
    activate: false
  };
  public maindeck = {
    lorry: 0, car: 0, motorcycle: 0, bicycle: 0, pedestarian: 0
  };
  public upperdeck = {
    lorry: 0, car: 0, motorcycle: 0, bicycle: 0, pedestarian: 0
  };
  public ferry_ops: FerryOps[] = new Array();
  
  constructor(public http: Http) {
    console.log('Hello Data Provider');
  }

  setFerryOps(ferry_ops: FerryOps) {
    localStorage.setItem('ferry_ops', JSON.stringify(this.ferry_ops));
  }

  getFerryOps() {
    this.ferry_ops = JSON.parse(localStorage.getItem('ferry_ops')) as FerryOps[];
    return this.ferry_ops;
  }

  public store(key: string, value: any) {

    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, value);
    }
    this.get(key);
  }

  public update(key: string, value: any) {
    localStorage.setItem(key, value);
    this.get(key);
  }

  public clear(key: string) {
    localStorage.removeItem(key);
  }

  public flush() {
    localStorage.clear();
  }

  public get(key) {
    let temp = localStorage.getItem(key);
    if (key == 'email') {
      this.data.email = temp;
    } else if (key == 'serverPath') {
      this.data.serverPath = temp;
    } else if (key == 'token') {
      this.data.token = temp;
    } else if (key == 'user_id') {
      this.data.user_id = temp;
    } else if (key == 'location') {
      this.data.location = temp;
    } else if (key == 'debug') {
      this.data.location = temp;
    } else if (key == 'name') {
      this.data.name = temp;
    } else if (key == 'activate') {
      this.data.activate = (temp == "true");
    }
    return temp;
  }

}