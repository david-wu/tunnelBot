import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  getSelectedImageStream$,
  ImageStreamsActions,
} from '@pp/image-streams/store/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'dwu-image-stream-overview',
  templateUrl: './image-stream-overview.component.html',
  styleUrls: ['./image-stream-overview.component.scss']
})
export class ImageStreamOverviewComponent {

  public selectedImageStream$: Observable<any>;

  constructor(
    public store: Store,
  ) {
    this.selectedImageStream$ = this.store.pipe(select(getSelectedImageStream$));
  }

  public onLabelChange(imageStreamId: string, label: string) {
    this.store.dispatch(ImageStreamsActions.updateImageStream({ imageStreamId, patch: { label } }));
  }

  public onDescriptionChange(imageStreamId: string, description: string) {
    this.store.dispatch(ImageStreamsActions.updateImageStream({ imageStreamId, patch: { description } }));
  }

}
