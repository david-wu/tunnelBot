import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GobblerComponent } from '@src/app/portfolio/gobbler-demo/gobbler/gobbler.component';
import { GblPieceComponent } from './gbl-piece/gbl-piece.component';

@NgModule({
  imports: [
    NgCommonModule,
  ],
  declarations: [
    GobblerComponent,
    GblPieceComponent,
  ],
  exports: [
    GobblerComponent,
  ],
})
export class GobblerModule { }
