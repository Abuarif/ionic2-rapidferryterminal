import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ferry } from './ferry';

@NgModule({
  declarations: [
    Ferry,
  ],
  imports: [
    IonicPageModule.forChild(Ferry),
  ],
  exports: [
    Ferry
  ]
})
export class FerryModule {}
