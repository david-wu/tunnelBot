import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocationViewerComponent } from '@common/location-viewer/location-viewer.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    LocationViewerComponent,
  ],
  exports: [
    LocationViewerComponent,
  ],
})
export class LocationViewerModule { }
