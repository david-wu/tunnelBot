import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  getSelectedImageClassifier$,
  ImageClassifiersActions,
} from '@pp/image-classifiers/store/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'dwu-image-classifier-overview',
  templateUrl: './image-classifier-overview.component.html',
  styleUrls: ['./image-classifier-overview.component.scss']
})
export class ImageClassifierOverviewComponent {

  public selectedImageClassifier$: Observable<any>;

  constructor(
    public store: Store,
  ) {
    this.selectedImageClassifier$ = this.store.pipe(select(getSelectedImageClassifier$));
  }

  public onLabelChange(imageClassifierId: string, label: string) {
    this.store.dispatch(ImageClassifiersActions.updateImageClassifier({ imageClassifierId, patch: { label } }));
  }

  public onDescriptionChange(imageClassifierId: string, description: string) {
    this.store.dispatch(ImageClassifiersActions.updateImageClassifier({ imageClassifierId, patch: { description } }));
  }

}
