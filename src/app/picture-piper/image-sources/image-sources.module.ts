import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserLoginModule } from '@app/user-login/user-login.module';
import { ImageSourcesComponent } from '@pp/image-sources/image-sources.component';
import { ImageSourcesRoutingModule } from '@pp/image-sources/image-sources.routes';
import { IMAGE_SOURCES_SERVICES } from '@pp/image-sources/services';
import {
  ImageSourcesEffects,
  imageSourcesReducer,
} from '@pp/image-sources/store/index';
import { SearchInputModule } from '@src/app/common/search-input/search-input.module';
import { ResourceListViewModule } from '@pp/common/resource-list-view/resource-list-view.module';
import { ResourceCreateButtonModule } from '@pp/common/resource-create-button/resource-create-button.module';

@NgModule({
  imports: [
    CommonModule,
    SearchInputModule,
    ResourceListViewModule,
    ResourceCreateButtonModule,
    ImageSourcesRoutingModule,
    UserLoginModule,
    StoreModule.forFeature('imageSources', imageSourcesReducer),
    EffectsModule.forFeature([ImageSourcesEffects]),
  ],
  declarations: [
    ImageSourcesComponent,
  ],
  exports: [
    ImageSourcesComponent,
  ],
  providers: [
    ...IMAGE_SOURCES_SERVICES,
  ],
})
export class ImageSourcesModule { }
