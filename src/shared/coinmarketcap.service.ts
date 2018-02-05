import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CoinMarketCapApi {

  private url: string = 'https://api.coinmarketcap.com/v1/ticker/?limit=250&convert=EUR';
  private globalUrl: string = 'https://api.coinmarketcap.com/v1/global/';

  constructor(private http: HttpClient) { }

  getCurrences() {
    return new Promise(resolve => {
      this.http.get(this.url)
        .subscribe(
        res => resolve(res),
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
        res => resolve(res),
        err => {
          console.log(err);
          alert('error getting totals from coinmarketcap');
        }
        )
    })
  }

}

