import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  public currences: Array<any>;

  ionViewWillEnter() {
    this.currences = this.data.paramData;
    //console.log(this.currences);

  }
  constructor(public navCtrl: NavController, public data: DataProvider) {
  }

}
