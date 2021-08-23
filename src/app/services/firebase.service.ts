import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  public firebase;

  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyCNPiqa4cqnd_tnPwNigHHw7fREF6-R3Fw",
      authDomain: "trendrunner-84e44.firebaseapp.com",
      databaseURL: "https://trendrunner-84e44.firebaseio.com",
      projectId: "trendrunner-84e44",
      storageBucket: "trendrunner-84e44.appspot.com",
      messagingSenderId: "456585926372",
      appId: "1:456585926372:web:f2ef3c703e39ba8b173ef1",
      measurementId: "G-6H11P5W2FP"
    });
    this.firebase = firebase;
  }
}

