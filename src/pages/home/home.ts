import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { returnMyCoins } from './myCoins';
import { CoinMarketCapApi } from '../../shared/shared';
import { Loading } from 'ionic-angular/components/loading/loading';

import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currences: Array<any>;
  loader: Loading;

  cmcTotalUSD: number = 0;
  cmcTotalEUR: number = 0;
  cmcTotalBTC: number = 0;
  cmcGeneratedDate: string = '';
  cmcGenerated: boolean = false;
  cmcTimerValue: string = '';
  cmcTimerId: number;

  globalGenerated: boolean = false;
  globalGeneratedDate: string = '';
  globalTimerValue: string = '';
  globalTimerId: number;
  totalMarketCap: number;
  total24hVolume: number;
  totalBTCDominance: number;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public data: DataProvider, private coinMarketCapApi: CoinMarketCapApi) {

  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  getCoinMarketCapGlobal() {
    this.globalGenerated = false;
    this.startTimer('globalTimerValue', 'globalTimerId');
    this.coinMarketCapApi.getGlobal().then(data => {
      this.totalMarketCap = (data as any).total_market_cap_usd;
      this.total24hVolume = (data as any).total_24h_volume_usd;
      this.totalBTCDominance = (data as any).bitcoin_percentage_of_market_cap;
      this.globalGeneratedDate = new Date().toLocaleString(navigator.language);
      clearInterval(this.globalTimerId);
      this.globalGenerated = true;
    });
  }

  getCoinMarketCap() {
    this.cmcGenerated = false;
    this.startTimer('cmcTimerValue', 'cmcTimerId');
    this.presentLoading();
    this.coinMarketCapApi.getCurrences().then(data => {
      this.currences = (data as Array<any>);
      var myCoins = returnMyCoins();
      this.cmcTotalUSD = 0;
      this.cmcTotalEUR = 0;
      this.cmcTotalBTC = 0;
      myCoins.forEach(elem => {
        var found = false;
        for (let i = 0; i < this.currences.length; i++) {
          if (this.currences[i].symbol === elem.symbol) {
            this.currences[i].price_usd = Number(this.currences[i].price_usd);
            this.currences[i].percent_change_1h = Number(this.currences[i].percent_change_1h);
            this.currences[i].percent_change_24h = Number(this.currences[i].percent_change_24h);
            this.currences[i].percent_change_7d = Number(this.currences[i].percent_change_7d);
            this.currences[i].amount = (this.currences[i].amount || 0) + elem.amount;
            var valUSD = elem.amount * this.currences[i].price_usd;
            this.currences[i].valueUSD = (this.currences[i].valueUSD || 0) + valUSD;
            this.cmcTotalUSD += valUSD;
            this.cmcTotalEUR += elem.amount * Number(this.currences[i].price_eur);
            this.cmcTotalBTC += elem.amount * this.currences[i].price_btc;
            found = true;
            break;
          }
        }
        if (!found) {
          console.error('The currency is not found - ' + elem.symbol);
          alert('The currency is not found - ' + elem.symbol);
        }
      });
      this.cmcGeneratedDate = new Date().toLocaleString(navigator.language);
      this.currences = this.currences.filter(elem => elem.valueUSD > 0);
      this.data.paramData = this.currences;
      clearInterval(this.cmcTimerId);
      this.loader.dismiss();
      this.cmcGenerated = true;
    })
  }

  getBalances() {
    console.log('get balances started....');
    this.getCoinMarketCap();
    this.getCoinMarketCapGlobal();
  }

  startTimer(timerValue, timerId) {
    var startTime: number = new Date().getTime();
    this[timerValue] = "Starting the timer...";
    this[timerId] = setInterval(() => {
      var ms: number = (new Date().getTime() - startTime);
      var x: number = ms / 1000;
      var seconds: number = Math.round(x % 60);
      x /= 60;
      var minutes = Math.round(x % 60);
      x /= 60;
      var hours = Math.round(x % 24);
      this[timerValue] =
        `${hours}h:${'00'.substring(0, 2 - ('' + minutes).length) + minutes}m:${'00'.substring(0, 2 - ('' + seconds).length) + seconds}s`;
    }, 1000);
  }

}
