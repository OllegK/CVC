import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public afd: AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
    //
  }

  getCoins() {
    //return this.afd.list('/shoppingItems/');
  }


/*
      if (!firebase.auth().currentUser) {
        console.log('authentication required');
        firebase.auth().signInWithEmailAndPassword(this.credentials[0], this.credentials[1]).catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log('FireBase authentication error', errorCode, errorMessage);
        });
      }
    }

      firebase.auth().onAuthStateChanged((user) => {
        if (user) { // User is signed in.
          this.arr = [];
          var userId = firebase.auth().currentUser.uid;
          return firebase.database().ref(`/${userId}/myCoins`).once('value').then((snapshot) => {
            var obj = Object.assign({}, snapshot.val());
            for (var key in obj) {
              var sum = obj[key].reduce((total, elem) => total + elem.balance || 0, 0);
              this.arr.push ({symbol: key, amount : sum })
            }
            console.log(this.arr);
          });
        }
      });
        'ok@ipr.lv', //firebase username
        '123abc'  //firebase password

*/

}




}
