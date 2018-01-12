import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class CoinMarketCapApi {

  private url : string = 'https://api.coinmarketcap.com/v1/ticker/?limit=100&convert=EUR';

  constructor(private http: Http) { }

  getCurrences() {
    return new Promise (resolve => {
      this.http.get(this.url)
        .subscribe (res => resolve(res.json()) )
    })
  }
}

