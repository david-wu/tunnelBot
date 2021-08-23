import { Injectable } from '@angular/core';

import { User } from '@models/index';
import { UploadFile } from '@photo-gallery/models/index';
import {
  ExifService,
  FirebaseFunctionsService,
  FirebaseFirestoreService,
  FirebaseStorageService,
  ImageProcessingService,
} from '@services/index';

@Injectable()
export class ImageStreamsService {

  constructor(
    public firebaseFunctionsService: FirebaseFunctionsService,
    public firestore: FirebaseFirestoreService,
    public storage: FirebaseStorageService,
    public imageProcessing: ImageProcessingService,
    public exifService: ExifService,
  ) {}

  /**
   * generateImageStreamToken
   */
  public async generateImageStreamToken(imageStreamId: string) {
    const generateToken = this.firebaseFunctionsService.functions.httpsCallable('generateImageStreamTokenTask');
    return await generateToken({ imageStreamId });
  }

  /**
   * deleteFile
   */
  public async deleteFile(uploadFileId: string) {
    await this.storage.deleteFile(uploadFileId);
    return await this.firestore.unregisterFile(uploadFileId);
  }

  /**
   * uploadImageStreamFile
   */
  public async uploadImageStreamFile(file: File, user: User, sourceId: string) {
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

  public updateImageStream(imageStreamId: string, patch: any) {
    return this.firestore.db.collection('imageStreams')
      .doc(imageStreamId)
      .update(patch);
  }

}
