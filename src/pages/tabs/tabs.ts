import { Component } from '@angular/core';

import { ListPage } from '../list/list';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ListPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
