import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { get, keyBy, map } from 'lodash';

import { UploadFile } from '@photo-gallery/models/upload-file.model';

@Component({
  selector: 'dwu-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: ['./image-grid.component.scss']
})
export class ImageGridComponent {

  @Input() files;
  @Input() zoomLevel = 3;
  @Output() deleteImage = new EventEmitter();

  public fileIds: string[];
  public filesById: Record<string, UploadFile>;
  public alwaysUseMaxColumns = true;
  public centeredTileId;
  public magnifiedImageId;
  public readonly tileOptions = [
    { maxWidth: 150, aspectRatio: 4 / 3 },
    { maxWidth: 320, aspectRatio: 4 / 3 },
    { maxWidth: 640, aspectRatio: 4 / 3 },
    { maxWidth: 1080, aspectRatio: 4 / 3 },
  ];

  public ngOnChanges(changes) {
    if (changes.files && this.files) {
      this.fileIds = map(this.files, (uploadFile: UploadFile) => uploadFile.id);
      this.filesById = keyBy(this.files, (uploadFile: UploadFile) => uploadFile.id);
      this.centeredTileId = undefined;
    }
  }

  public getImgSrc(uploadFileId: string, imageWidth: number): string {
    imageWidth = Math.min(640, imageWidth);
    return get(this.filesById, [
      uploadFileId,
      'uploadMeta',
      `downloadUrl_${imageWidth}`,
    ]);
  }

  public onZoomIn(imageId: string) {
    this.magnifiedImageId = imageId;
  }

  public onDeleteImage(imageId: string) {
    this.deleteImage.emit(imageId);
  }

  public downloadImage(imageId: string) {
    const file = this.filesById[imageId];
    const downloadUrl = file.uploadMeta.downloadUrl;
    const Url = window.URL || (window as any).webkitURL;
    const xhr = new XMLHttpRequest();
    const aEl: any = document.createElement('a');

    xhr.open('GET', downloadUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      const file = new Blob([xhr.response], { type : 'application/octet-stream' });
      aEl.href = Url.createObjectURL(file);
      aEl.download = `${imageId}.jpg`;
      aEl.style = 'display: none';
      document.body.appendChild(aEl);
      aEl.click();
      aEl.remove();
    };
    xhr.send();
  }

}
