import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import {
  getSelectedImageSource$,
  ImageSourcesActions,
} from '@pp/image-sources/store/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'dwu-image-source-test-app',
  templateUrl: './image-source-test-app.component.html',
  styleUrls: ['./image-source-test-app.component.scss']
})
export class ImageSourceTestAppComponent {

  public selectedImageSource$: Observable<any>;

  constructor(
    public store: Store,
  ) {
    this.selectedImageSource$ = this.store.pipe(select(getSelectedImageSource$));
  }

}
