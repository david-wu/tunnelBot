import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageSourceTestAppComponent } from '@pp/image-sources/image-source-view/image-source-test-app/image-source-test-app.component';
import { ImageSourceTestAppRoutingModule } from '@pp/image-sources/image-source-view/image-source-test-app/image-source-test-app.routes';

@NgModule({
  imports: [
    CommonModule,
    ImageSourceTestAppRoutingModule,
  ],
  declarations: [
    ImageSourceTestAppComponent,
  ],
  exports: [
    ImageSourceTestAppComponent,
  ],
})
export class ImageSourceTestAppModule { }
