import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import { HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class CryptoCompareApi {

  private url: string = 'https://min-api.cryptocompare.com/data/pricemulti';

  constructor(private http: HttpClient) { }

  getCurrences(fsyms : string, tsyms : string) {
    let httpParams = new HttpParams().set('fsyms', fsyms).set('tsyms', tsyms);
    return new Promise(resolve => {
      this.http.get(this.url, {params: httpParams})
        .subscribe(
        res => resolve(res),
        err => {
          console.log(err);
          alert('error calling cryptocompare');
        }
        )
    })
  }

}

