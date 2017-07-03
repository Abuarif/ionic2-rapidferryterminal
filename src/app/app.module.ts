import { About } from './../pages/about/about';
import { Settings } from './../pages/settings/settings';
import { Ferry } from './../pages/ferry/ferry';
import { Api } from './../providers/api';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataApi } from "../providers/data-api";

@NgModule({
  declarations: [
    MyApp,
    About,
    HomePage,
    Ferry,
    Settings,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    About,
    HomePage,
    Ferry,
    Settings,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Api,
    DataApi,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
