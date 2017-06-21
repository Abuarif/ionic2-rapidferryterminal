import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class Api {
  serverPath: string = 'http://ferry.bersepadu.com';

  constructor(private http: Http) {}

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

  public get_ferrytrips() {
    console.log('get_ferrytrips');
    return new Promise((resolve, reject) => {

      this.http.get(this.serverPath + '/api/ferrytrips.json')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  
}

