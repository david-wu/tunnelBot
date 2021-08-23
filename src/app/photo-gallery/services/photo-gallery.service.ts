import { Injectable } from '@angular/core';

import { User } from '@models/index';
import { UploadFile } from '@photo-gallery/models/index';
import {
  ExifService,
  FirebaseFirestoreService,
  FirebaseStorageService,
  ImageProcessingService,
} from '@services/index';
import { UserLocationService } from '@src/app/photo-gallery/services/user-location.service';

@Injectable()
export class PhotoGalleryService {

  constructor(
    public firestore: FirebaseFirestoreService,
    public storage: FirebaseStorageService,
    public userLocationService: UserLocationService,
    public imageProcessing: ImageProcessingService,
    public exifService: ExifService,
  ) {}

  /**
   * deleteFile
   * @param {string} uploadFileId
   * @param {User}   user
   */
  public async deleteFile(uploadFileId: string, user: User) {
    await this.storage.deleteFile(uploadFileId);
    await this.firestore.unregisterFile(uploadFileId);
  }

  /**
   * uploadFile
   * @param {File} file
   * @param {User} user
   */
  public async uploadFile(file: File, user: User) {
    const exifData = await this.exifService.getExifData(file);
    const exifLocationData = this.exifService.getLocationData(exifData);
    const locationData = exifLocationData || await this.userLocationService.getUserLocation();

    const uploadDoc = {
      userId: user.uid,
      fileName: file.name,
      isUploaded: false,
      locationData: { ...locationData },
    } as UploadFile;
    const insertedUploadDocRef = await this.firestore.insertUploadDoc(uploadDoc);
    const insertedUploadDoc = {
      ...uploadDoc,
      id: insertedUploadDocRef.id,
    };

    const sizedFile = await this.imageProcessing.processImageFile(file, exifData);
    const fileUploadResponse = await this.storage.uploadFile(sizedFile, insertedUploadDoc.id);
    const downloadUrl = await fileUploadResponse.ref.getDownloadURL();
    const uploadMeta = { downloadUrl };
    await this.firestore.registerFileUploaded(insertedUploadDoc.id, uploadMeta);
  }

}
