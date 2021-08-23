import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  getSelectedImageSourceId$,
} from '@pp/image-sources/store/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'dwu-image-source-images-view',
  templateUrl: './image-source-images-view.component.html',
  styleUrls: ['./image-source-images-view.component.scss']
})
export class ImageSourceImagesViewComponent {

  public selectedImageSourceId$: Observable<string>;

  constructor(
    public store: Store,
  ) {
    this.selectedImageSourceId$ = this.store.pipe(select(getSelectedImageSourceId$));
  }

  public onFileUpload(file) {
    console.log('onFileUpload', file);
  }

}
