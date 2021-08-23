import { Component } from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import { LocationData } from '@photo-gallery/models/index';
import { UploadFile } from '@photo-gallery/models/upload-file.model';
import {
  getNearbyImages$,
  getUserLocation$,
  PhotoGalleryActions,
} from '@photo-gallery/store/index';

@Component({
  selector: 'dwu-near-me-grid',
  templateUrl: './near-me-grid.component.html',
  styleUrls: ['./near-me-grid.component.scss']
})
export class NearMeGridComponent {

  public userLocation$: Observable<LocationData>;
  public nearByUploads$: Observable<UploadFile[]>;
  public zoomLevel = 3;
  public viewingLocationPicker = true;
  public defaultLoc = LocationData.fromLatLong(37.803, -122.271);

  constructor(public store: Store) {
    this.nearByUploads$ = this.store.pipe(select(getNearbyImages$));
    this.userLocation$ = this.store.pipe(select(getUserLocation$));
  }

  public ngOnInit() {
    this.store.dispatch(PhotoGalleryActions.setNearbyImagesVisible({ payload: true }));
  }

  public ngOnDestroy() {
    this.store.dispatch(PhotoGalleryActions.setNearbyImagesVisible({ payload: false }));
  }

  public onLocationChange(location: LocationData) {
    this.store.dispatch(PhotoGalleryActions.setUserLocation({ payload: location }));
  }

  public onUseMyLocation() {
    this.store.dispatch(PhotoGalleryActions.requestUserLocation());
  }
}
