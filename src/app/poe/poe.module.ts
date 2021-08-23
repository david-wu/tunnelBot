import { CommonModule } from '@angular/common';
import {
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PoeComponent } from '@src/app/poe/poe.component';
import { PoeRoutingModule } from '@src/app/poe/poe.routes';
// import { FirebaseAuthModule } from '@src/app/firebase-auth/firebase-auth.module';
import { PoeService } from '@src/app/poe/services/poe.service';

@NgModule({
  declarations: [
    PoeComponent,
  ],
  imports: [
    PoeRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    // FirebaseAuthModule,
  ],
  exports: [
    PoeComponent,
  ],
  providers: [
    PoeService,
  ],
})
export class PoeModule { }
