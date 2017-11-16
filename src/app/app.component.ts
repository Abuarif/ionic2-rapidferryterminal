import { AuthServiceProvider } from './../providers/auth-service/auth-service';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(
    private platform: Platform, 
    private statusBar: StatusBar, 
    private splashScreen: SplashScreen,
    public authService: AuthServiceProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // if (this.connectivityService.isOnline()) {
        if (!this.platform.is('cordova')) {
          this.authService.native = true;
        }

        if (this.authService.authenticated) {
          this.rootPage = TabsPage
        } else {
          this.rootPage = LoginPage
        }
    });
  }
}
