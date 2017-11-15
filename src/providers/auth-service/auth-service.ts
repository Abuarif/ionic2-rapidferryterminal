import { DataApiProvider } from './../data-api/data-api';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthServiceProvider {

  private isLoggedIn = false;
  public native = false;

  constructor(
    public dataApi: DataApiProvider
  ) { }

  ionViewCanEnter() {
    let status = false;
    if (this.dataApi.get('activate') == 'true') {
      status = true;
    }
    this.setStatus(status);
  }
  // Login a user
  // Normally make a server request and store
  // e.g. the auth token
  login(): void {
    this.isLoggedIn = true;
  }

  // Logout a user, destroy token and remove
  // every information related to a user
  logout(): void {
    this.isLoggedIn = false;
    this.dataApi.update('activate', this.isLoggedIn);
  }

  // Returns whether the user is currently authenticated
  // Could check if current token is still valid
  authenticated(): boolean {
    let status = false;
    if (this.dataApi.get('activate') == 'true') {
      status = true;
    }
    this.setStatus(status);

    return this.isLoggedIn;
  }

  public setStatus(status: boolean) {
    this.isLoggedIn = status;
  }
}