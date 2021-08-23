import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserLoginModule } from '@app/user-login/user-login.module';
import { ImageStreamsComponent } from '@pp/image-streams/image-streams.component';
import { ImageStreamsRoutingModule } from '@pp/image-streams/image-streams.routes';
import { IMAGE_STREAMS_SERVICES } from '@pp/image-streams/services';
import {
  ImageStreamsEffects,
  imageStreamsReducer,
} from '@pp/image-streams/store/index';
import { SearchInputModule } from '@src/app/common/search-input/search-input.module';
import { ResourceListViewModule } from '@pp/common/resource-list-view/resource-list-view.module';
import { ResourceCreateButtonModule } from '@pp/common/resource-create-button/resource-create-button.module';

@NgModule({
  imports: [
    CommonModule,
    SearchInputModule,
    ResourceListViewModule,
    ResourceCreateButtonModule,
    ImageStreamsRoutingModule,
    UserLoginModule,
    StoreModule.forFeature('imageStreams', imageStreamsReducer),
    EffectsModule.forFeature([ImageStreamsEffects]),
  ],
  declarations: [
    ImageStreamsComponent,
  ],
  exports: [
    ImageStreamsComponent,
  ],
  providers: [
    ...IMAGE_STREAMS_SERVICES,
  ],
})
export class ImageStreamsModule { }
