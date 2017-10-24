import { FerryLoadPage } from './../pages/ferry-load/ferry-load';
import { ProfileUpdatePage } from './../pages/profile-update/profile-update';
import { LoginPage } from './../pages/login/login';
import { Trip } from './../pages/trip/trip';
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
import { DatePipe } from '@angular/common';
import { AuthGuardProvider } from '../providers/auth-guard/auth-guard';

@NgModule({
  declarations: [
    MyApp,
    About,
    HomePage,
    Ferry,
    Trip,
    Settings,
    LoginPage,
    ProfileUpdatePage,
    FerryLoadPage,
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
    Trip,
    Settings,
    LoginPage,
    ProfileUpdatePage,
    FerryLoadPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Api,
    DataApi,
    DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthGuardProvider
  ]
})
export class AppModule {}
