import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { returnMyCoins } from './myCoins';
import { CoinMarketCapApi } from '../../shared/shared';
import { Loading } from 'ionic-angular/components/loading/loading';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currences : Array<any>;
  totalUSD : number = 0;
  totalEUR : number = 0;
  totalBTC : number = 0;
  generatedDate : string = '';
  generated : boolean = false;
  timerValue : string = '';
  timerId : number;
  loader : Loading;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private coinMarketCapApi : CoinMarketCapApi) {

  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  getBalances() {
    console.log('get balances started....');
    this.generated = false;
    this.startTimer();
    this.presentLoading();
    this.coinMarketCapApi.getCurrences().then(data => {
      this.currences = (data as Array<any>);
      var myCoins = returnMyCoins();
      this.totalUSD = 0;
      this.totalEUR = 0;
      this.totalBTC = 0;
      this.generated = false;
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
                  this.totalUSD += valUSD;
                  this.totalEUR += elem.amount * Number(this.currences[i].price_eur);
                  this.totalBTC += elem.amount * this.currences[i].price_btc;
                  found = true;
                  break;
              }
          }
          if (!found) {
              console.error('The currency is not found - ' + elem.symbol);
              alert('The currency is not found - ' + elem.symbol);
          }
      });
      this.generatedDate = new Date().toLocaleString(navigator.language);
      this.currences = this.currences.filter (elem => elem.valueUSD > 0);
      clearInterval(this.timerId);
      this.loader.dismiss();
      this.generated = true;
    })
  }

  startTimer() {
    var startTime : number = new Date().getTime();
    this.timerValue = "Starting the timer...";
    this.timerId = setInterval(() => {
        var ms : number = (new Date().getTime() - startTime);
        var x : number = ms / 1000;
        var seconds : number = Math.round(x % 60);
        x /= 60;
        var minutes = Math.round(x % 60);
        x /= 60;
        var hours = Math.round(x % 24);
        this.timerValue =
            `${hours}h:${'00'.substring(0, 2 - ('' + minutes).length) + minutes}m:${'00'.substring(0, 2 - ('' + seconds).length) + seconds}s`;
    }, 1000);
  }

}
