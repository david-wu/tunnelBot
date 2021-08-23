import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PicturePiperDemoComponent } from '@src/app/portfolio/picture-piper-demo/picture-piper-demo.component';
import { PicturePiperDemoRoutingModule } from '@src/app/portfolio/picture-piper-demo/picture-piper-demo.routes';

@NgModule({
  imports: [
    NgCommonModule,
    PicturePiperDemoRoutingModule,
  ],
  declarations: [
    PicturePiperDemoComponent,
  ],
  exports: [
    PicturePiperDemoComponent,
  ],
})
export class PicturePiperDemoModule { }
