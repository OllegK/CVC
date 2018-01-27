import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { CoinMarketCapApi, CryptoCompareApi } from '../shared/shared';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  templateUrl: 'app.html',
  providers: [
    CoinMarketCapApi,
    CryptoCompareApi,
    HttpClient,
    HttpClientModule
  ]
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
