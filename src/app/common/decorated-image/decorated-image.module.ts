import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DecoratedImageComponent } from '@src/app/common/decorated-image/decorated-image.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DecoratedImageComponent,
  ],
  exports: [
    DecoratedImageComponent,
  ],
  providers: [],
})
export class DecoratedImageModule { }
