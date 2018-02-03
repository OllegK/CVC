import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the ServiceAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceAuthProvider {

  private user: Observable<firebase.User>;


  constructor(private _firebaseAuth: AngularFireAuth) {
    console.log('Hello ServiceAuthProvider Provider');
    this.user = _firebaseAuth.authState;
  }

  getUserId() {
    if (this._firebaseAuth.auth.currentUser) {
      return this._firebaseAuth.auth.currentUser.uid;
    }
  }

  signInRegular(email, password) {
    // const credential = firebase.auth.EmailAuthProvider.credential( email, password );
    //if (!firebase.auth().currentUser) {

    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

}


