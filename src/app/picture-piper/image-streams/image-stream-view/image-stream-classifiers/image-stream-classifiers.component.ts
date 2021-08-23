import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  getSelectedImageStream$,
} from '@pp/image-streams/store/index';
import { PicturePiperActions } from '@pp/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dwu-image-stream-classifiers',
  templateUrl: './image-stream-classifiers.component.html',
  styleUrls: ['./image-stream-classifiers.component.scss']
})
export class ImageStreamClassifiersComponent {

  public selectedImageStream$: Observable<any>;
  public imageSourceIds$: Observable<any>;
  public classifierIds$: Observable<any>;

  constructor(
    public store: Store,
    ) {
    this.selectedImageStream$ = this.store.pipe(select(getSelectedImageStream$));
    this.imageSourceIds$ = this.selectedImageStream$.pipe(
      map((imageStream) => new Set(imageStream.sourceIds)),
    );
    this.classifierIds$ = this.selectedImageStream$.pipe(
      map((imageStream) => new Set(imageStream.classifierIds)),
    );
  }

  public ngOnInit() {

  }

  public onSelectedImageSourceIdsChange(imageStreamId: string, ids: Set<string>) {
    // this.selectedImageSourceIds = selectedImageSourceIds;
    const sourceIds = Array.from(ids || []).sort();
    console.log('sourceIds', sourceIds);
    this.store.dispatch(PicturePiperActions.patchResourceDoc({
      resource: {
        path: `imageStreams/${imageStreamId}`,
      },
      patch: { sourceIds }
    }));
  }

  public onSelectedClassifierIdsChange(imageStreamId: string, ids: Set<string>) {
    // this.selectedClassifierIds = selectedClassifierIds;
    const classifierIds = Array.from(ids || []).sort();
    this.store.dispatch(PicturePiperActions.patchResourceDoc({
      resource: {
        path: `imageStreams/${imageStreamId}`,
      },
      patch: { classifierIds }
    }));
  }

  public onSave(streamId, patch) {
    this.store.dispatch(PicturePiperActions.patchResourceDoc({
      resource: {
        path: `imageStreams/${streamId}`,
      },
      patch
    }));
  }

  // public onLabelChange(imageStreamId: string, label: string) {
    //   this.store.dispatch(ImageStreamsActions.updateImageStream({ imageStreamId, patch: { label } }));
    // }

    // public onDescriptionChange(imageStreamId: string, description: string) {
      //   this.store.dispatch(ImageStreamsActions.updateImageStream({ imageStreamId, patch: { description } }));
      // }

    }
