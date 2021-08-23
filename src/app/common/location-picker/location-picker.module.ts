import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocationViewerModule } from '@common/location-viewer/location-viewer.module';
import { LocationPickerComponent } from '@src/app/common/location-picker/location-picker.component';

@NgModule({
  imports: [
    CommonModule,
    LocationViewerModule,
  ],
  declarations: [
    LocationPickerComponent,
  ],
  exports: [
    LocationPickerComponent,
  ],
})
export class LocationPickerModule { }
