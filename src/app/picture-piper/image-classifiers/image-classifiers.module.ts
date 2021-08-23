import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserLoginModule } from '@app/user-login/user-login.module';
import { ImageClassifiersComponent } from '@pp/image-classifiers/image-classifiers.component';
import { ImageClassifiersRoutingModule } from '@pp/image-classifiers/image-classifiers.routes';
import { IMAGE_CLASSIFIERS_SERVICES } from '@pp/image-classifiers/services';
import {
  ImageClassifiersEffects,
  imageClassifiersReducer,
} from '@pp/image-classifiers/store/index';
import { SearchInputModule } from '@src/app/common/search-input/search-input.module';
import { ResourceListViewModule } from '@pp/common/resource-list-view/resource-list-view.module';
import { ResourceCreateButtonModule } from '@pp/common/resource-create-button/resource-create-button.module';

@NgModule({
  imports: [
    CommonModule,
    SearchInputModule,
    ResourceListViewModule,
    ResourceCreateButtonModule,
    ImageClassifiersRoutingModule,
    UserLoginModule,
    StoreModule.forFeature('imageClassifiers', imageClassifiersReducer),
    EffectsModule.forFeature([ImageClassifiersEffects]),
  ],
  declarations: [
    ImageClassifiersComponent,
  ],
  exports: [
    ImageClassifiersComponent,
  ],
  providers: [
    ...IMAGE_CLASSIFIERS_SERVICES,
  ],
})
export class ImageClassifiersModule { }
