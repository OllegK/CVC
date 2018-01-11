import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { returnMyCoins } from './myCoins';
import { CoinMarketCapApi } from '../../shared/shared';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  currences : any;
  totalUSD : number = 0;
  totalEUR : number = 0;
  totalBTC : number = 0;

  constructor(public navCtrl: NavController, private coinMarketCapApi : CoinMarketCapApi) {

  }

  getBalances() {
    this.coinMarketCapApi.getCurrences().then(data => {
      this.currences = data;
      console.log(this.currences);
      var myCoins = returnMyCoins();
      myCoins.forEach(elem => {
          console.log('Analyzing ticker - ' + elem.symbol);
          var found = false;
          for (let i = 0; i < this.currences.length; i++) {
              if (this.currences[i].symbol === elem.symbol) {
                  this.currences[i].amount = (this.currences[i].amount || 0) + elem.amount;
                  var valUSD = elem.amount * Number(this.currences[i].price_usd);
                  console.log(elem.amount, this.currences[i].price_usd, valUSD);
                  this.currences[i].valueUSD = (this.currences[i].valueUSD || 0) + valUSD;
                  this.totalUSD += valUSD;
                  this.totalEUR += elem.amount * Number(this.currences[i].price_eur);
                  this.totalBTC += elem.amount * this.currences[i].price_btc;
                  found = true;
                  console.log(this.totalUSD);
                  break;
              }
          }
          if (!found) {
              alert('The currency is not found - ' + elem.symbol);
          }
      });
      //this.totalUSD = this.totalUSD.toLocaleString("en", {style: "currency", currency: "USD"});
      //this.totalEUR = this.totalUSD.toLocaleString("en", {style: "currency", currency: "EUR"});

    })
  }
}
