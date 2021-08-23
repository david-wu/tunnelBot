import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@models/index';
import { FirebaseService } from './firebase.service';
import firebase from 'firebase/app';
import 'firebase/auth';
// var firebaseui = require('firebaseui');
import * as firebaseui from 'firebaseui';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {

  public firebaseAuth = this.firebaseService.firebase.auth();
  public FirebaseAuthUI = firebaseui.auth.AuthUI;
  // public firebaseAuthUI: any;

  public defaultUiConfig = {
    signInSuccessUrl: '#/auth-success',
    callbacks: {
      signInSuccess: () => false,
    },
    signInOptions: [
      this.firebaseService.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // this.firebaseService.firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // this.firebaseService.firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      this.firebaseService.firebase.auth.GithubAuthProvider.PROVIDER_ID,
      // this.firebaseService.firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // this.firebaseService.firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      // window.firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
    // Terms of service and privacy url/callback.
    // tosUrl: '<your-tos-url>',
    // privacyPolicyUrl: function() {
    //   window.location.assign('<your-privacy-policy-url>');
    // },
  };
  public user$ = new BehaviorSubject<User>(undefined);
  public authLoading$: Observable<boolean>;
  public canLogin$: Observable<boolean>;

  constructor(public firebaseService: FirebaseService) {
    // this.initialize();
    this.authLoading$ = this.user$.pipe(
      map((user: User) => user === undefined),
    );
    this.canLogin$ = this.user$.pipe(
      map((user: User) => user === null),
    );
  }

  // public initialize() {
  //   // this.firebaseAuthUI = window.firebaseui.auth.AuthUI.getInstance() || new this.FirebaseAuthUI(this.firebaseAuth);
  //   this.firebaseAuth.onAuthStateChanged((userData) => {
  //     if (userData === null) {
  //       this.user$.next(null);
  //       return;
  //     }
  //     const user = Object.assign(new User(), {
  //       uid: userData.uid,
  //       displayName: userData.displayName,
  //       email: userData.email,
  //       emailVerified: userData.emailVerified,
  //       photoURL: userData.photoURL,
  //     });
  //     this.user$.next(user);
  //   });
  //   return this.user$;
  // }

  public getUser$(): Observable<User> {
    // this.firebaseAuthUI = window.firebaseui.auth.AuthUI.getInstance() || new this.FirebaseAuthUI(this.firebaseAuth);
    this.firebaseAuth.onAuthStateChanged((userData) => {
      if (userData === null) {
        this.user$.next(null);
        return;
      }
      const user = Object.assign(new User(), {
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email,
        emailVerified: userData.emailVerified,
        photoURL: userData.photoURL,
      });
      this.user$.next(user);
    });
    return this.user$;
  }

  public renderLogin(hostEl: HTMLElement): Observable<User> {
    const firebaseAuthUI = firebaseui.auth.AuthUI.getInstance() || new this.FirebaseAuthUI(this.firebaseAuth);
    // firebaseAuthUI.start(hostEl, {
      // ...this.defaultUiConfig,
    // });
    return this.user$.asObservable();
  }

  public signOut(): Observable<any> {
    return from(this.firebaseAuth.signOut());
  }

}
