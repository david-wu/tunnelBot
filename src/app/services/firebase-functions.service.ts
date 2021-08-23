import { Injectable } from '@angular/core';

import { FirebaseService } from './firebase.service';
import 'firebase/functions';

@Injectable({
  providedIn: 'root',
})
export class FirebaseFunctionsService {

  public functions = this.firebaseService.firebase.functions();

  constructor(public firebaseService: FirebaseService) {}
}
