import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuardProvider {

  constructor() { }

  public static isAuthenticated(): boolean {
    if (localStorage.getItem('currentUser')) {
      return true
    } else {
      return false
    }
  }
}
