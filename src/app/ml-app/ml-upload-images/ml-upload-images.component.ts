import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { File, FileGroup } from '@file-explorer/index';

@Component({
  selector: 'ml-upload-images',
  templateUrl: './ml-upload-images.component.html',
  styleUrls: ['./ml-upload-images.component.scss']
})
export class MlUploadImagesComponent {

  public filesById: Record<string, File> = {};
  public filesByLabel: Record<string, File> = {};
  public fileGroup: FileGroup = new FileGroup();
  public filterStr = '';
  public zipAcceptStr = 'zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed';

  constructor(
    public router: Router,
    public route: ActivatedRoute,
  ) {
  }

  public onFileChange(file) {

  }
}
