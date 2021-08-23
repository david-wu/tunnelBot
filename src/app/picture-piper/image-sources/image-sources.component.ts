import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getUser$ } from '@app/store';
import { User } from '@models/index';
import {
  getSelectedImageSourceId$,
  ImageSourcesActions,
} from '@pp/image-sources/store/index';

@Component({
  selector: 'dwu-image-sources',
  templateUrl: './image-sources.component.html',
  styleUrls: ['./image-sources.component.scss']
})
export class ImageSourcesComponent {

  public user$: Observable<User>;
  public selectedImageSourceId$: Observable<string>;

  public filterStr = '';
  public leftSideExpanded = false;
  public sub;
  public readonly imageSourcesConfig = {
    path: 'imageSources',
  }

  constructor(
    public store: Store,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {
    this.user$ = this.store.pipe(select(getUser$));
    this.selectedImageSourceId$ = this.store.pipe(select(getSelectedImageSourceId$));

    this.loadInUrlState(this.router.url);
    this.sub = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.loadInUrlState(routerEvent.url);
      }
    });
  }

  public onSelectedImageSourceIdChange(selectedImageSourceId: string) {
    const urlTree = this.router.createUrlTree([selectedImageSourceId], { relativeTo: this.activatedRoute });
    this.store.dispatch(ImageSourcesActions.navigateToImageSourceView({ payload: urlTree.toString() }));
  }

  /**
   * loadInUrlState
   * @param {string} url
   */
  public loadInUrlState(url: string) {
    const urlArr = url.split('/');
    const baseIndex = urlArr.indexOf('image-sources');
    const idIndex = baseIndex + 1;
    const tabIndex = baseIndex + 2;

    const imageSourceId = urlArr[idIndex] === 'intro' ? undefined : urlArr[idIndex];
    const tabName = urlArr[tabIndex];
    this.store.dispatch(ImageSourcesActions.setSelectedImageSourceId({ payload: imageSourceId }));
    this.store.dispatch(ImageSourcesActions.setImageSourceViewTab({ payload: tabName }));
  }
}
