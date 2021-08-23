import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AboutMeComponent } from '@src/app/about-me/about-me.component';
import { AboutMeRoutingModule } from '@src/app/about-me/about-me.routes';

@NgModule({
  imports: [
    AboutMeRoutingModule,
    CommonModule,
  ],
  declarations: [
    AboutMeComponent,
  ],
  exports: [
    AboutMeComponent,
  ],
  providers: [],
})
export class AboutMeModule { }
