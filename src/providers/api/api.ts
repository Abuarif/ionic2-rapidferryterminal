import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatePipe } from '@angular/common';

@Injectable()
export class ApiProvider {

  public static readonly server = 'https://ferryservice.prasarana.com.my';

  constructor(private http: Http, private datePipe: DatePipe) { }


  public signin(username, password) {
    return new Promise((resolve, reject) => {

      this.http.get(ApiProvider.server + '/api/signin.json?username=' + username + '&password=' + password)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public signup(staffNumber, email) {
    return new Promise((resolve, reject) => {

      this.http.get(ApiProvider.server + '/api/signup.json'
        + '?staff_number=' + staffNumber
        + '&email=' + email)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }
  
    public check_user(staffNumber, email) {
      return new Promise((resolve, reject) => {
        this.http.get(ApiProvider.server + '/api/check.json'
          + '?staff_number=' + staffNumber
          + '&email=' + email)
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
      });
    }
    
      public get_info(staffNumber) {
        return new Promise((resolve, reject) => {
          this.http.get(ApiProvider.server + '/api/info.json'
            + '?staff_number=' + staffNumber )
            .subscribe(res => {
              resolve(res.json());
            }, (err) => {
              reject(err);
            });
        });
      }

  public submitTag(direction: number, lat: number, long: number, timestamp: string, reason: string) {
    return new Promise((resolve, reject) => {
      timestamp = this.datePipe.transform(timestamp, 'yyyy-MM-dd H:mm:ss');
      console.log('timestamp: ' + timestamp);

      this.http.get(ApiProvider.server + '/api/log.json?key=' + localStorage.getItem("token")
        + '&direction=' + direction
        + '&lat=' + lat + '&long='
        + long + '&user_id='
        + localStorage.getItem("user_id")
        + '&tag_date=' + timestamp
        + '&reason=' + reason
      )
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public get_submission_history(limit) {
    return new Promise((resolve, reject) => {

      this.http.get(ApiProvider.server + '/api/activity.json?key=' + localStorage.getItem("token") + '&limit=' + limit)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public get_latest() {
    return new Promise((resolve, reject) => {

      this.http.get(ApiProvider.server + '/api/last.json?user_id=' + localStorage.getItem("user_id"))
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  public get_staffs_history(limit) {
    return new Promise((resolve, reject) => {

      this.http.get(ApiProvider.server + '/api/activities.json?limit=' + limit)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }


  public get_reasons() {
    return new Promise((resolve, reject) => {

      this.http.get(ApiProvider.server + '/api/reasons.json')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }



}
