import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  debounce,
} from 'lodash';

import { LocationData } from '@photo-gallery/models/index';

@Component({
  selector: 'dwu-location-viewer',
  templateUrl: './location-viewer.component.html',
  styleUrls: ['./location-viewer.component.scss']
})
export class LocationViewerComponent {

  @Input() location: LocationData;
  @Output() locationChange = new EventEmitter<LocationData>();
  @Input() markers;
  @ViewChild('mapContainerEl', { static: true }) mapContainerEl: ElementRef<any>;

  public map;
  public debouncedLocationChange;

  constructor() {
    this.debouncedLocationChange = debounce(() => {
      this.locationChange.emit(this.location);
    }, 100);
  }

  public ngOnChanges(changes) {
    if (changes.location) {
      this.setMapCenter();
    }
  }

  public ngOnInit() {
    this.setMapCenter();
  }

  public setMapCenter() {
    const center = {
      lat: this.location.latitude,
      lng: this.location.longitude,
    };
    if (!this.map) {
      this.map = new (window as any).google.maps.Map(this.mapContainerEl.nativeElement, {
        zoom: 13,
        center,
        disableDefaultUI: true,
      });
      this.map.addListener('center_changed', () => {
        const center = this.map.getCenter();
        this.location = LocationData.fromLatLong(center.lat(), center.lng());
        this.debouncedLocationChange();
      });
      this.locationChange.emit(this.location);
    } else {
      const mapCenter = this.map.getCenter();
      if ((mapCenter.lat() !== center.lat) || (mapCenter.lng() !== center.lng)) {
        this.map.setCenter(center);
      }
    }
  }

}
