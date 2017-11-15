import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FerryAssignmentPage } from './ferry-assignment';

@NgModule({
  declarations: [
    FerryAssignmentPage,
  ],
  imports: [
    IonicPageModule.forChild(FerryAssignmentPage),
  ],
  exports: [
    FerryAssignmentPage
  ]
})
export class FerryAssignmentPageModule {}
