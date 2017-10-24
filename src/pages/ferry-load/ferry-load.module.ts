import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FerryLoadPage } from './ferry-load';

@NgModule({
  declarations: [
    FerryLoadPage,
  ],
  imports: [
    IonicPageModule.forChild(FerryLoadPage),
  ],
  exports: [
    FerryLoadPage
  ]
})
export class FerryLoadPageModule {}
