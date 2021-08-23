import { Injectable } from '@angular/core';
import {
  from,
  Observable,
} from 'rxjs';

import { User } from '@models/index';
import {
  ExifService,
  FirebaseFirestoreService,
  FirebaseStorageService,
  ImageProcessingService,
} from '@services/index';

@Injectable()
export class PicturePiperService {

  constructor(
    public firestore: FirebaseFirestoreService,
    public storage: FirebaseStorageService,
    public imageProcessing: ImageProcessingService,
    public exifService: ExifService,
  ) {}

  public getFilesForSource$(sourceId: string): Observable<any[]> {
    return this.firestore.query((db) => {
      return db
        .collection('ppUploads')
        .where('sourceId', '==', sourceId)
        .orderBy('updatedAt', 'desc')
    });
  }

  public getResourceList$(user: User, resource: any): Observable<any[]> {
    return this.firestore.query((db) => {
      return db
        .collection(resource.path)
        .where('userId', '==', user.uid)
        .orderBy('updatedAt', 'desc');
    });
  }

  public getResourceDoc$(user: User, resource: any): Observable<any[]> {
    return this.firestore.queryDoc((db) => {
      return db.doc(resource.path);
    });
  }


  public patchResourceDoc(user: User, resource: any, patch): Observable<any> {
    // console.log('patchResourceDoc', resource.path, patch);
    return from(this.firestore.db.doc(resource.path).update(patch));
  }

  public createResourceDoc(user: User, resource: any, patch): Observable<any> {
    // console.log('createResourceDoc', resource.path, patch);
    const timestamp = this.firestore.firestoreTimestamp();
    const doc = {
      userId: user.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    return from(this.firestore.db.collection(resource.path).add(doc));
  }

  public getImageSources$(user: User): Observable<any[]> {
    return this.firestore.query((db) => {
      return db
        .collection('imageSources')
        .where('userId', '==', user.uid)
        .orderBy('updatedAt', 'desc');
    });
  }

  public getImageStreams$(user: User): Observable<any[]> {
    return this.firestore.query((db) => {
      return db
        .collection('imageStreams')
        .where('userId', '==', user.uid)
        .orderBy('updatedAt', 'desc');
    });
  }

}
