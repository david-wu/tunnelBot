import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  getSelectedImageClassifierId$,
} from '@pp/image-classifiers/store/index';

@Component({
  selector: 'dwu-image-classifier-view',
  templateUrl: './image-classifier-view.component.html',
  styleUrls: ['./image-classifier-view.component.scss']
})
export class ImageClassifierViewComponent {

  public selectedImageClassifierId$: Observable<string>;

  constructor(
    public store: Store,
  ) {
    this.selectedImageClassifierId$ = this.store.pipe(select(getSelectedImageClassifierId$));
  }

  public onFileUpload(files) {
    console.log('uploading', files);
  }


}
