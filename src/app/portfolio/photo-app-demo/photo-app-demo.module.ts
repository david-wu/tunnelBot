import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PhotoAppDemoComponent } from '@src/app/portfolio/photo-app-demo/photo-app-demo.component';
import { PhotoAppDemoRoutingModule } from '@src/app/portfolio/photo-app-demo/photo-app-demo.routes';

@NgModule({
  imports: [
    NgCommonModule,
    PhotoAppDemoRoutingModule,
  ],
  declarations: [
    PhotoAppDemoComponent,
  ],
  exports: [
    PhotoAppDemoComponent,
  ],
})
export class PhotoAppDemoModule { }
