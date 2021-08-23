import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZoomLevelPickerComponent } from '@src/app/common/zoom-level-picker/zoom-level-picker.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ZoomLevelPickerComponent,
  ],
  exports: [
    ZoomLevelPickerComponent,
  ],
  providers: [],
})
export class ZoomLevelPickerModule { }
