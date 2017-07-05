import { DatePipe } from '@angular/common';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class Api {
  serverPath: string = 'http://ferry.bersepadu.com';

  constructor(private http: Http, private datePipe: DatePipe) {}

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

  public set_ferrytrip(location, route_id, route_timetable_id, service_date, isOnTime, isAvailable, time_depart) {
    console.log('set_ferrytrips');
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/set_ferrytrip.json?' +
      'location='           + location + 
      '&route_id='           + route_id + 
      '&route_timetable_id=' + route_timetable_id + 
      '&service_date='       + this.datePipe.transform(service_date, 'yyyy-MM-dd') + 
      '&isOnTime='           + isOnTime + 
      '&time_depart='        + this.datePipe.transform(time_depart, 'yyyy-MM-dd H:mm:ss') + 
      '&isAvailable='        + isAvailable 
      )
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
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

  
}