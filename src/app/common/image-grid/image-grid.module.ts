import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DecoratedImageModule } from '@common/decorated-image/decorated-image.module';
import { ImageGridComponent } from '@common/image-grid/image-grid.component';
import { VirtualScrollGridModule } from '@common/virtual-scroll-grid/virtual-scroll-grid.module';

@NgModule({
  imports: [
    CommonModule,
    DecoratedImageModule,
    VirtualScrollGridModule,
  ],
  declarations: [
    ImageGridComponent,
  ],
  exports: [
    ImageGridComponent,
  ],
})
export class ImageGridModule { }
