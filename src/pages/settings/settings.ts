import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  email: string = '';
  password: string = '';
  showPasswordText: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appPreferences: AppPreferences) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');

    this.appPreferences.fetch('fbpassword').then((res) => {
      this.password = res;
     });

     this.appPreferences.fetch('fbemail').then((res) => {
      this.email = res;
     });

  }

  saveSettings() {
    console.log('Save settings... - ', this.password);
    this.appPreferences.store('fbpassword', this.password).then((res) => { console.log(res) });
    this.appPreferences.store('fbemail', this.email).then((res) => { console.log(res) });
  }

}
