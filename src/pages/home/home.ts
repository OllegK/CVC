import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { FirebaseProvider } from './../../providers/firebase/firebase';

import { CoinMarketCapApi, CryptoCompareApi } from '../../shared/shared';
import { Loading } from 'ionic-angular/components/loading/loading';

import { DataProvider } from '../../providers/data/data';
import { ServiceAuthProvider } from '../../providers/service-auth/service-auth';



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

  ccTotalUSD: number = 0;
  ccTotalEUR: number = 0;
  ccTotalBTC: number = 0;
  ccGeneratedDate: string = '';
  ccGenerated: boolean = false;
  ccTimerValue: string = '';
  ccTimerId: number;

  globalGenerated: boolean = false;
  globalGeneratedDate: string = '';
  globalTimerValue: string = '';
  globalTimerId: number;
  totalMarketCap: number;
  total24hVolume: number;
  totalBTCDominance: number;

  myCoins: Array<any>;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public data: DataProvider,
    private coinMarketCapApi: CoinMarketCapApi,
    private cryptoCompareApi: CryptoCompareApi,
    public firebaseProvider: FirebaseProvider,
    public authService: ServiceAuthProvider) {



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
      this.globalGenerated = true;
      clearInterval(this.globalTimerId);
    });
  }

  getCryptoCompare() {

    var adjustForCc = function (sym) {
      var obj = {
        MIOTA: 'IOTA',
        BCC: 'BCCOIN'
      }
      if (obj.hasOwnProperty(sym)) {
        return obj[sym];
      } else {
        return sym;
      }
    }

    var myCoins: string = this.myCoins.map(elem => adjustForCc(elem.symbol)).join(',');
    this.ccGenerated = false;
    this.startTimer('ccTimerValue', 'ccTimerId');
    this.cryptoCompareApi.getCurrences(myCoins, 'USD,EUR,BTC').then(data => {
      console.log(data);
      this.ccTotalUSD = 0;
      this.ccTotalEUR = 0;
      this.ccTotalBTC = 0;
      this.ccGeneratedDate = new Date().toLocaleString(navigator.language);
      this.myCoins.forEach(elem => {
        console.log('Analyzing ticker - ' + elem.symbol);
        var symbol = adjustForCc(elem.symbol);
        if (data.hasOwnProperty(symbol)) {
          this.ccTotalUSD += data[symbol]['USD'] * elem.amount;
          this.ccTotalEUR += data[symbol]['EUR'] * elem.amount;
          this.ccTotalBTC += data[symbol]['BTC'] * elem.amount;
        } else {
        //  alert('The currency is not found - ' + symbol);
          console.error('The currency is not found - ' + symbol);
        }
      });
      this.ccGenerated = true;
      clearInterval(this.ccTimerId);
    })
  }

  getCoinMarketCap() {
    this.cmcGenerated = false;
    this.startTimer('cmcTimerValue', 'cmcTimerId');
    this.presentLoading();
    this.coinMarketCapApi.getCurrences().then(data => {
      this.currences = (data as Array<any>);
      this.cmcTotalUSD = 0;
      this.cmcTotalEUR = 0;
      this.cmcTotalBTC = 0;
      this.myCoins.forEach(elem => {
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
          //alert('The currency is not found - ' + elem.symbol);
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

    this.firebaseProvider.getCoins().then((snapshot) => {

      console.log(snapshot);

      var obj = Object.assign({}, snapshot.val());
      console.log(obj);
      this.myCoins = [];
      for (var key in obj) {
        var sum = obj[key].reduce((total, elem) => total + elem.balance || 0, 0);
        this.myCoins.push({ symbol: key, amount: sum })
      }
      this.getCoinMarketCap();
      this.getCryptoCompare();
      this.getCoinMarketCapGlobal();

    });
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
