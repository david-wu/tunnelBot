import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  getSelectedImageStreamId$,
} from '@pp/image-streams/store/index';

@Component({
  selector: 'dwu-image-stream-view',
  templateUrl: './image-stream-view.component.html',
  styleUrls: ['./image-stream-view.component.scss']
})
export class ImageStreamViewComponent {

  public selectedImageStreamId$: Observable<string>;

  constructor(
    public store: Store,
  ) {
    this.selectedImageStreamId$ = this.store.pipe(select(getSelectedImageStreamId$));
  }

  public onFileUpload(files) {
    console.log('uploading', files);
  }


}
