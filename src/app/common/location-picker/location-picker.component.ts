import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { LocationData } from '@photo-gallery/models/index';

@Component({
  selector: 'dwu-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent {

  @Input() location: LocationData;
  @Output() locationChange = new EventEmitter<LocationData>();
  @Output() useMyLocation = new EventEmitter();

  public onUseMyLocation() {
    this.useMyLocation.emit();
  }

  public onLocationChange(location: LocationData) {
    this.location = location;
    this.locationChange.emit(location);
  }

}
