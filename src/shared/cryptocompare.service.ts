import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class CryptoCompareApi {

  private url: string = 'https://min-api.cryptocompare.com/data/pricemulti';

  constructor(private http: Http) { }

  getCurrences() {
    return new Promise(resolve => {
      this.http.get(this.url)
        .subscribe(
        res => resolve(res.json()),
        err => {
          console.log(err);
          alert('error calling cryptocompare');
        }
        )
    })
  }

}

