import { DatePipe } from '@angular/common';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiProvider {
  serverPath: string = 'https://ferryservice.prasarana.com.my';
  // serverPath: string = 'http://ferry.bersepadu.com';

  constructor(private http: Http, private datePipe: DatePipe) { }

  public signin(username, password) {
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/auth.json?username=' + username + '&password=' + password)

        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public get_ferrytrips(location) {
    console.log('get_ferrytrips');
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/get_ferrytrips.json?location=' + location)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public set_ferrytrip(page, location, route_id, route_timetable_id, service_date, isOnTime, isFull, time_depart, delayed_departure, isCancelled, actual_ferry, lorry, car, motorcycle, bicycle, pedestarian) {
    console.log('set_ferrytrips');
    return new Promise((resolve, reject) => {

      let url = '';

      if (delayed_departure) {
        url = this.serverPath + '/api/set_ferrytrip.json?' +
          'page=' + page +
          '&location=' + location +
          '&route_id=' + route_id +
          '&route_timetable_id=' + route_timetable_id +
          '&service_date=' + this.datePipe.transform(service_date, 'yyyy-MM-dd') +
          '&isOnTime=' + isOnTime +
          '&isFull=' + isFull +
          '&time_depart=' + this.datePipe.transform(time_depart, 'yyyy-MM-dd H:mm') +
          '&delayed_departure=' + this.datePipe.transform(delayed_departure, 'yyyy-MM-dd H:mm') +
          '&isCancelled=' + isCancelled +
          '&actual_ferry=' + actual_ferry +
          '&lorry=' + lorry +
          '&car=' + car +
          '&motorcycle=' + motorcycle +
          '&bicycle=' + bicycle +
          '&pedestarian=' + pedestarian +
          '';
      } else {
        url = this.serverPath + '/api/set_ferrytrip.json?' +
          'page=' + page +
          '&location=' + location +
          '&route_id=' + route_id +
          '&route_timetable_id=' + route_timetable_id +
          '&service_date=' + this.datePipe.transform(service_date, 'yyyy-MM-dd') +
          '&isOnTime=' + isOnTime +
          '&isFull=' + isFull +
          '&time_depart=' + this.datePipe.transform(time_depart, 'yyyy-MM-dd H:mm') +
          '';
      }

      console.log(url);
      this.http.get(url)
        .subscribe(res => {
          resolve(res.json());
          console.log('Successful submission.');
        }, (err) => {
          reject(err);
          console.log('Failed submission.');
        });
    });
  }

  public get_ferryroutes(location) {
    console.log('get_ferryroutes');
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/get_ferryroutes.json?location=' + location)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public get_history(location) {
    console.log('get_history');
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/get_trip_history.json?location=' + location)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public populate_trip() {
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/populate_trip.json')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public get_ferry() {
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/get_ferry.json')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public get_ferry_order() {
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/get_ferry_order.json')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public get_ferry_ops(service_date) {
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/get_ferry_ops.json'
        + '?service_date=' + this.datePipe.transform(service_date, 'yyyy-MM-dd'))
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public set_ferry_ops(service_date, a, b, c, d, e, f) {
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/set_ferry_ops.json'
        + '?service_date=' + this.datePipe.transform(service_date, 'yyyy-MM-dd')
        + '&ferry_a=' + a
        + '&ferry_b=' + b
        + '&ferry_c=' + c
        + '&ferry_d=' + d
        + '&ferry_e=' + e
        + '&ferry_f=' + f
      )
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public add_ferry_op(data) {
    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded'
    }); // set json as Content-Type http header
    let options = new RequestOptions({ headers: headers }); // encapsulate header into http request options
    let body = JSON.stringify(data); // convert user Account object into JSON format
    console.log(body)
    return new Promise((resolve, reject) => {
      this.http.post(this.serverPath + '/api/set_ferry_ops.json', body, options)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });

  }

  public delete_trip() {
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/delete_trip.json')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

}