import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class CoinMarketCapApi {

  private url: string = 'https://api.coinmarketcap.com/v1/ticker/?limit=200&convert=EUR';
  private globalUrl: string = 'https://api.coinmarketcap.com/v1/global/';

  constructor(private http: Http) { }

  getCurrences() {
    return new Promise(resolve => {
      this.http.get(this.url)
        .subscribe(
        res => resolve(res.json()),
        err => {
          console.log(err);
          alert('error calling coinmarketcap');
        }
        )
    })
  }

  getGlobal() {
    return new Promise(resolve => {
      this.http.get(this.globalUrl)
        .subscribe(
        res => resolve(res.json()),
        err => {
          console.log(err);
          alert('error getting totals from coinmarketcap');
        }
        )
    })
  }

}

