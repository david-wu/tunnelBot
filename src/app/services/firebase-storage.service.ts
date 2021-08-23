import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {

  public firebaseStorage = this.firebaseService.firebase.storage();

  constructor(public firebaseService: FirebaseService) {}

  public uploadFile(file: File, fileName: string= 'image.jpg') {
    const storageRef = this.firebaseStorage.ref();
    const imageRef = storageRef.child('uploads').child(fileName);
    return imageRef.put(file);
  }

  public uploadZip(file: File, fileName: string= 'file.zip') {
    const storageRef = this.firebaseStorage.ref();
    const imageRef = storageRef.child('uploadZips').child(fileName);
    return imageRef.put(file);
  }

  public async deleteFile(fileName: string= 'image.jpg') {
    const storageRef = this.firebaseStorage.ref();
    const imageRef = storageRef.child(`uploads/${fileName}`);
    return imageRef.delete()
      .catch((error) => {
        if (error.code === 'storage/object-not-found') {
          return;
        }
        throw(error);
      });
  }

}
