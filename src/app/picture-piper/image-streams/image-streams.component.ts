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
import { Observable, Subscription } from 'rxjs';

import { getUser$ } from '@app/store';
import { User } from '@models/index';
import {
  getSelectedImageStreamId$,
  ImageStreamsActions,
} from '@pp/image-streams/store/index';

@Component({
  selector: 'dwu-image-streams',
  templateUrl: './image-streams.component.html',
  styleUrls: ['./image-streams.component.scss']
})
export class ImageStreamsComponent {

  public user$: Observable<User>;
  public selectedImageStreamId$: Observable<string>;

  public filterStr = '';
  public leftSideExpanded = false;
  public sub: Subscription;
  public readonly imageStreamsConfig = {
    path: 'imageStreams',
  };

  constructor(
    public store: Store,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {
    this.user$ = this.store.pipe(select(getUser$));
    this.selectedImageStreamId$ = this.store.pipe(select(getSelectedImageStreamId$));
  }

  public ngOnInit() {
    this.loadInUrlState(this.router.url);
    this.sub = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.loadInUrlState(routerEvent.url);
      }
    });
  }

  public ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  public onSelectedImageStreamIdChange(selectedImageStreamId: string) {
    const urlTree = this.router.createUrlTree([selectedImageStreamId], { relativeTo: this.activatedRoute });
    this.store.dispatch(ImageStreamsActions.navigateToImageStreamView({ payload: urlTree.toString() }));
  }

  /**
   * loadInUrlState
   * @param {string} url
   */
  public loadInUrlState(url: string) {
    const urlArr = url.split('/');
    const baseIndex = urlArr.indexOf('image-streams');
    const idIndex = baseIndex + 1;
    const tabIndex = baseIndex + 2;

    const imageStreamId = urlArr[idIndex] === 'intro' ? undefined : urlArr[idIndex];
    const tabName = urlArr[tabIndex];
    this.store.dispatch(ImageStreamsActions.setSelectedImageStreamId({ payload: imageStreamId }));
    this.store.dispatch(ImageStreamsActions.setImageStreamViewTab({ payload: tabName }));
  }
}
