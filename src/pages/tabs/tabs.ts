import { Settings } from './../settings/settings';
import { Ferry } from './../ferry/ferry';
import { Component } from '@angular/core';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = Ferry;
  tab3Root = Settings;

  constructor() {

  }
}
