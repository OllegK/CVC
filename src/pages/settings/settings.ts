import { Component } from '@angular/core';
import { NavController, NavParams, Tabs  } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';
import { ServiceAuthProvider } from '../../providers/service-auth/service-auth';



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

  email: string = 'ok@ipr.lv'; //temp
  password: string = '';
  showPasswordText: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private appPreferences: AppPreferences,
    private authService: ServiceAuthProvider ) {
  }

  selectTab(index: number) {
    var t: Tabs = this.navCtrl.parent;
    t.select(index);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');

    this.appPreferences.fetch('fbpassword').then((res) => {
      this.password = res;
     });

     this.appPreferences.fetch('fbemail').then((res) => {
      this.email = res || this.email;
     });

  }

  saveSettings() {
    console.log('Save settings... - ', this.password);
    this.appPreferences.store('fbpassword', this.password).then((res) => { console.log(res) });
    this.appPreferences.store('fbemail', this.email).then((res) => { console.log(res) });
  }

  doLogin(){
    console.log('do login...');
      this.authService.signInRegular(this.email, this.password)
         .then((res) => {
          console.log('Authenticated');
          console.log(res);
            //this.router.navigate(['dashboard']);
            this.selectTab(0);
         })
         .catch((err) => console.log('error: ' + err));
   }

}
