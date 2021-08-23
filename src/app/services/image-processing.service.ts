import { Injectable } from '@angular/core';
import * as Jimp from 'jimp';

@Injectable()
export class ImageProcessingService {

  public static imageSizes = {
    lg: 1080,
    md: 640,
    sm: 320,
    xs: 150,
  };
  public quarterTurnOrientations = new Set([5, 6, 7, 8]);

  public async processImageFile(file: File, exifData: any): Promise<File> {
    let jimp = await this.getJimpFromFile(file);
    const orientation = exifData && exifData.Orientation;
    jimp = jimp.quality(80);
    jimp = this.resizeImage(jimp, orientation);
    jimp = this.uprightImage(jimp, orientation);
    return await this.getFileFromJimp(jimp, file.name);
  }

  public uprightImage(jimp: any, orientation: number) {
    if (orientation === 5 || orientation === 6) {
      jimp = jimp.rotate(90);
    }
    if (orientation === 7 || orientation === 8) {
      jimp = jimp.rotate(270);
    }
    if (orientation === 3 || orientation === 4) {
      jimp = jimp.rotate(180);
    }
    return jimp;
  }

  public resizeImage(jimp: any, orientation: number) {
    if (this.quarterTurnOrientations.has(orientation)) {
      jimp = jimp.resize(
        Jimp.AUTO,
        ImageProcessingService.imageSizes.lg,
      );
    } else {
      jimp = jimp.resize(
        ImageProcessingService.imageSizes.lg,
        Jimp.AUTO,
      );
    }
    return jimp;
  }

  public async getJimpFromFile(file: File) {
    const fileBlob = new Blob([file]) as any;
    const fileBuffer = await fileBlob.arrayBuffer();
    return await Jimp.read(fileBuffer as any);
  }

  public getFileFromJimp(jimpImage, fileName): Promise<File> {
    return new Promise((resolve, reject) => {
      jimpImage.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
        if (err) {
          reject(err);
        }
        const newBlob = new Blob([buffer]);
        const file = new File([newBlob], fileName);
        resolve(file);
      });
    });
  }

}
