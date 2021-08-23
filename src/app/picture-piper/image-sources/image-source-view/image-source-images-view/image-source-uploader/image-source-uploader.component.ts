import {
  Component,
  Input,
} from '@angular/core';
import {
  Store,
} from '@ngrx/store';
import {
  ImageSourcesActions,
} from '@pp/image-sources/store/index';

@Component({
  selector: 'dwu-image-source-uploader',
  templateUrl: './image-source-uploader.component.html',
  styleUrls: ['./image-source-uploader.component.scss']
})
export class ImageSourceUploaderComponent {

  @Input() selectedImageSourceId: string;

  constructor(public store: Store) {}

  public onFileUpload(file) {
    this.store.dispatch(ImageSourcesActions.uploadImageSourceFile({
      selectedImageSourceId: this.selectedImageSourceId,
      file,
    }));
  }

}
