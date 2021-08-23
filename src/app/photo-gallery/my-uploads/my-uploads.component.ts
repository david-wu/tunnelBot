import { Component } from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import { getUser$ } from '@app/store';
import { User } from '@models/index';
import { UploadFile } from '@photo-gallery/models/upload-file.model';
import { PhotoGalleryService } from '@photo-gallery/services/index';
import {
  getMyUploads$,
  PhotoGalleryActions,
} from '@photo-gallery/store/index';
import { FirebaseAuthService } from '@services/index';

@Component({
  selector: 'dwu-my-uploads',
  templateUrl: './my-uploads.component.html',
  styleUrls: ['./my-uploads.component.scss']
})
export class MyUploadsComponent {

  public user$: Observable<User>;
  public uploadedFiles$: Observable<UploadFile[]>;
  public zoomLevel = 3;
  public viewingFilePicker = true;

  constructor(
    public store: Store,
    public pgs: PhotoGalleryService,
    public firebaseAuthService: FirebaseAuthService,
  ) {
    this.user$ = this.store.pipe(select(getUser$));
    this.uploadedFiles$ = this.store.pipe(select(getMyUploads$));
  }

  public async onFileChange(file: File, user: User) {
    this.pgs.uploadFile(file, user);
  }

  public ngOnInit() {
    this.store.dispatch(PhotoGalleryActions.setMyUploadsVisible({ payload: true }));
  }

  public ngOnDestroy() {
    this.store.dispatch(PhotoGalleryActions.setMyUploadsVisible({ payload: false }));
  }

  public onDeleteImage(imageId: string, user: User) {
    this.pgs.deleteFile(imageId, user);
  }

}
