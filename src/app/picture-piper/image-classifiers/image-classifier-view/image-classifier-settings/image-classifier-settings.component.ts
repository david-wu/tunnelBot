import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  getSelectedImageClassifier$,
} from '@pp/image-classifiers/store/index';
import { PicturePiperActions } from '@pp/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dwu-image-classifier-settings',
  templateUrl: './image-classifier-settings.component.html',
  styleUrls: ['./image-classifier-settings.component.scss']
})
export class ImageClassifierSettingsComponent {

  public selectedImageClassifier$: Observable<any>;
  public imageSourceIds$: Observable<any>;
  public classifierIds$: Observable<any>;

  constructor(
    public store: Store,
    ) {
    this.selectedImageClassifier$ = this.store.pipe(select(getSelectedImageClassifier$));
    this.imageSourceIds$ = this.selectedImageClassifier$.pipe(
      map((imageClassifier) => new Set(imageClassifier.sourceIds)),
    );
    this.classifierIds$ = this.selectedImageClassifier$.pipe(
      map((imageClassifier) => new Set(imageClassifier.classifierIds)),
    );
  }

  public ngOnInit() {

  }

  public onSelectedImageSourceIdsChange(imageClassifierId: string, ids: Set<string>) {
    // this.selectedImageSourceIds = selectedImageSourceIds;
    const sourceIds = Array.from(ids || []).sort();
    console.log('sourceIds', sourceIds);
    this.store.dispatch(PicturePiperActions.patchResourceDoc({
      resource: {
        path: `imageClassifiers/${imageClassifierId}`,
      },
      patch: { sourceIds }
    }));
  }

  public onSelectedClassifierIdsChange(imageClassifierId: string, ids: Set<string>) {
    // this.selectedClassifierIds = selectedClassifierIds;
    const classifierIds = Array.from(ids || []).sort();
    this.store.dispatch(PicturePiperActions.patchResourceDoc({
      resource: {
        path: `imageClassifiers/${imageClassifierId}`,
      },
      patch: { classifierIds }
    }));
  }

  public onSave(classifierId, patch) {
    this.store.dispatch(PicturePiperActions.patchResourceDoc({
      resource: {
        path: `imageClassifiers/${classifierId}`,
      },
      patch
    }));
  }

  // public onLabelChange(imageClassifierId: string, label: string) {
    //   this.store.dispatch(ImageClassifiersActions.updateImageClassifier({ imageClassifierId, patch: { label } }));
    // }

    // public onDescriptionChange(imageClassifierId: string, description: string) {
      //   this.store.dispatch(ImageClassifiersActions.updateImageClassifier({ imageClassifierId, patch: { description } }));
      // }

    }
