import {
  Component,
  Input,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  getImagesBySourceId$,
  ImageSourcesActions,
} from '@pp/image-sources/store/index';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dwu-image-source-images',
  templateUrl: './image-source-images.component.html',
  styleUrls: ['./image-source-images.component.scss']
})
export class ImageSourceImagesComponent {

  @Input() selectedImageSourceId: string;

  public images$: Observable<any[]>;
  public zoomLevel = 5;

  constructor(public store: Store) {
    this.images$ = this.store.pipe(
      select(getImagesBySourceId$),
      map((imagesBySourceId: Record<string, any[]>) => imagesBySourceId[this.selectedImageSourceId] || []),
    );
  }

  public ngOnChanges(changes) {
    if (changes.selectedImageSourceId) {
      this.store.dispatch(ImageSourcesActions.loadImagesBySourceId({ payload: this.selectedImageSourceId }));
    }
  }

  public onDeleteImage(fileId) {
    this.store.dispatch(ImageSourcesActions.deleteUpload({ payload: fileId }));
  }

}
