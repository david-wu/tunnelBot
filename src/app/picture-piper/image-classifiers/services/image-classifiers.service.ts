import { Injectable } from '@angular/core';

import { User } from '@models/index';
import { UploadFile } from '@photo-gallery/models/index';
import {
  ExifService,
  FirebaseFirestoreService,
  FirebaseStorageService,
  ImageProcessingService,
} from '@services/index';

@Injectable()
export class ImageClassifiersService {

  constructor(
    public firestore: FirebaseFirestoreService,
    public storage: FirebaseStorageService,
    public imageProcessing: ImageProcessingService,
    public exifService: ExifService,
  ) {}

  /**
   * deleteFile
   */
  public async deleteFile(uploadFileId: string) {
    await this.storage.deleteFile(uploadFileId);
    return await this.firestore.unregisterFile(uploadFileId);
  }

  /**
   * uploadImageClassifierFile
   */
  public async uploadImageClassifierFile(file: File, user: User, sourceId: string) {
    const exifData = await this.exifService.getExifData(file);
    const exifLocationData = this.exifService.getLocationData(exifData);

    const uploadDoc = {
      userId: user.uid,
      fileName: file.name,
      isUploaded: false,
      sourceId,
      locationData: { ...exifLocationData },
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
    return await this.firestore.registerFileUploaded(insertedUploadDoc.id, uploadMeta);
  }

  public updateImageClassifier(imageClassifierId: string, patch: any) {
    return this.firestore.db.collection('imageClassifiers')
      .doc(imageClassifierId)
      .update(patch);
  }

}
