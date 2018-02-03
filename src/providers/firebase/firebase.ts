import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ServiceAuthProvider } from '../service-auth/service-auth';


/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public afd: AngularFireDatabase, private authService: ServiceAuthProvider) {
    console.log('Hello FirebaseProvider Provider');

  }

  getCoins() {
    var userId = this.authService.getUserId();
    if (!userId) {
      alert('Not authenticated');
      return (new Promise(() => { })); //todo
    }
    console.log('inside get coins - ' + userId);
    return this.afd.database.ref(`/${userId}/myCoins`).once('value');
  }

}
