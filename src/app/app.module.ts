import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  AuthEffects,
  authReducer,
} from '@app/store/index';
import { APP_SERVICES } from '@services/index';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';

@NgModule({
  imports: [
    NoopAnimationsModule,
    AppRoutingModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ...APP_SERVICES,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
