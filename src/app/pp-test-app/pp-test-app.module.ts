import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PpTestAppComponent } from '@app/pp-test-app/pp-test-app.component';
import { PpTestAppRoutingModule } from '@app/pp-test-app/pp-test-app.routes';

@NgModule({
  imports: [
    CommonModule,
    PpTestAppRoutingModule,
  ],
  declarations: [
    PpTestAppComponent,
  ],
  exports: [
    PpTestAppComponent,
  ],
})
export class PpTestAppModule { }
