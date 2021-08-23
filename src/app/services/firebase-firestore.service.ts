import { Injectable } from '@angular/core';
import { padStart } from 'lodash';
import {
  from,
  Observable,
  Subject,
} from 'rxjs';
import { map } from 'rxjs/operators';
const bigInt = require('big-integer');

import { FirebaseService } from './firebase.service';
import 'firebase/firestore';

import { User } from '@models/index';

@Injectable({
  providedIn: 'root',
})
export class FirebaseFirestoreService {

  public db = this.firebaseService.firebase.firestore();
  public firestoreTimestamp = this.firebaseService.firebase.firestore.FieldValue.serverTimestamp;

  constructor(public firebaseService: FirebaseService) {}

  public createImageSource(user: User): Observable<any> {
    const timestamp = this.firestoreTimestamp();
    const imageSource = {
      userId: user.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    return from(this.db.collection('imageSources').add(imageSource));
  }

  public createImageStream(user: User): Observable<any> {
    const timestamp = this.firestoreTimestamp();
    const imageStream = {
      userId: user.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    return from(this.db.collection('imageStreams').add(imageStream));
  }

  /**
   * updateUser
   * @param  {User} user
   * @return {Observable<User>}
   */
  public updateUser(user: User): Observable<User> {
    const userDoc = this.db.doc(`users/${user.uid}`);
    const promise = userDoc.set({ ...user });
    return from(promise).pipe(
      map(() => user),
    );
  }

  /**
   * unregisterFile
   * @param {string} fileId
   * @param {User} user
   */
  public async unregisterFile(fileId: string) {
    const uploadDoc = this.db.doc(`uploads/${fileId}`);
    return await uploadDoc.delete();
  }

  /**
   * insertUploadDoc
   * Initial creation of upload document
   * @param {File} file
   * @param {User} user
   * @return {Promise<DocumentReference>} docRef
   */
  public async insertUploadDoc(uploadDoc: any): Promise<any> {
    const timestamp = this.firestoreTimestamp();
    uploadDoc.createdAt = timestamp;
    uploadDoc.updatedAt = timestamp;
    return await this.db.collection('uploads').add(uploadDoc);
  }

  /**
   * registerFileUploaded
   * @param {string} fileId
   * @param {any} uploadMeta
   */
  public async registerFileUploaded(fileId: string, uploadMeta: any) {
    const uploadIndexDoc = this.db.doc(`uploads/${fileId}`);
    return await uploadIndexDoc.update({
      isUploaded: true,
      uploadMeta,
    });
  }

  public getUploadedFiles$(user: User): Observable<any[]> {
    const querySnapshot$ = Observable.create((observer) => {
      return this.db
        .collection('uploads')
        .where('userId', '==', user.uid)
        .orderBy('updatedAt', 'desc')
        .onSnapshot(observer);
    });

    return querySnapshot$.pipe(
      map((querySnapshot: any) => {
        return querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
      }),
    );
  }

  public getFilesForSource$(sourceId: string): Observable<any[]> {
    const querySnapshot$ = Observable.create((observer) => {
      return this.db
        .collection('uploads')
        .where('sourceId', '==', sourceId)
        .orderBy('updatedAt', 'desc')
        .onSnapshot(observer);
    });

    return querySnapshot$.pipe(
      map((querySnapshot: any) => {
        return querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
      }),
    );
  }

  public getFilesForStream$(sourceId: string): Observable<any[]> {
    const querySnapshot$ = Observable.create((observer) => {
      return this.db
        .collection('uploads')
        .where('sourceId', '==', sourceId)
        .orderBy('updatedAt', 'desc')
        .onSnapshot(observer);
    });

    return querySnapshot$.pipe(
      map((querySnapshot: any) => {
        return querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
      }),
    );
  }

  public getNearbyUploads$(userLocation: any, distanceType: string= 'DRIVE') {
    const distanceTargetsByType = {
      WALK: Math.pow(10, 12) * 7,
      BIKE: Math.pow(10, 12) * 7 * 5,
      DRIVE: Math.pow(10, 12) * 7 * 5 * 40,
    };
    const distanceTargetInS2 = bigInt(distanceTargetsByType[distanceType]);
    const userS2 = bigInt(userLocation.s2Id);
    // ignore first 4 chars to avoid big math
    // const preKeyStr = userLocation.s2Id.slice(0, 4);
    // const keyNum = Number(userLocation.s2Id.slice(4));

    const walkingRange = [
      padStart(userS2.minus(distanceTargetInS2).toString(), 22, '0'),
      padStart(userS2.add(distanceTargetInS2).toString(), 22, '0'),
    ];
    // const walkingRange = [
    //   String(Number(userLocation.s2Id) - walkingDistanceInS2),
    //   String(Number(userLocation.s2Id) + walkingDistanceInS2),
    // ];
    // const lastGeohashChar = walkingRange[walkingRange.length - 1];
    // const nextGeohashChar = String.fromCharCode(lastGeohashChar.charCodeAt(0) + 1);
    // const walkingRangeEnd = userLocation.geohash.slice(0, 4) + nextGeohashChar;
    const collection = this.db.collection(`uploads`)
      .where('locationData.s2Id', '>=', walkingRange[0])
      .where('locationData.s2Id', '<=', walkingRange[1]);

    // client filtering
    // const userLoc = [
    //   userLocation.latitude,
    //   userLocation.longitude,
    // ];
    // const milesAway = 0.5;
    // const degreesAway = milesAway / 69;
    // const uploadLatitudeBounds = [
    //   userLoc[0] - milesAway,
    //   userLoc[0] + milesAway,
    // ];
    // const uploadLongitudeBounds = [
    //   userLoc[1] - milesAway,
    //   userLoc[1] + milesAway,
    // ];

    const nearbyUploads$ = new Subject<any[]>();
    collection.onSnapshot((querySnapshot) => {
      const docs = querySnapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      nearbyUploads$.next(docs);
    });
    return nearbyUploads$;
  }

  public query(queryFunc) {
    const querySnapshot$ = Observable.create((observer) => {
      return queryFunc(this.db)
        .onSnapshot(observer);
    });
    return querySnapshot$.pipe(
      map((querySnapshot: any) => {
        return querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        });
      }),
    );
  }

  public queryDoc(queryDocFunc) {
    const querySnapshot$ = Observable.create((observer) => {
      return queryDocFunc(this.db)
        .onSnapshot(observer);
    });
    return querySnapshot$.pipe(
      map((doc: any) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      }),
    );
  }
}

