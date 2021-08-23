import {
  Component,
} from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  getIsSelectedSourceGeneratingToken$,
  getSelectedImageSourceId$,
  ImageSourcesActions,
} from '@pp/image-sources/store/index';

@Component({
  selector: 'dwu-image-source-setup',
  templateUrl: './image-source-setup.component.html',
  styleUrls: ['./image-source-setup.component.scss']
})
export class ImageSourceSetupComponent {

  public selectedImageSourceId$: Observable<string>;
  public isGeneratingToken$: Observable<boolean>;
  public filterStr: string;
  public selectedToken: any;

  constructor(
    public store: Store,
  ) {
    this.selectedImageSourceId$ = this.store.pipe(select(getSelectedImageSourceId$));
    this.isGeneratingToken$ = this.store.pipe(select(getIsSelectedSourceGeneratingToken$));
  }

  public generateImageSourceToken(selectedImageSourceId: string) {
    this.store.dispatch(ImageSourcesActions.generateImageSourceToken({ payload: selectedImageSourceId }));
  }

  public getUsage(imageSourceId: string) {
    const usage =
`const Piper = require('picture-piper').Piper;
const secret = require('./secret.json');

const piper = new Piper(secret);
piper.send(imageBlob);
`;
    return usage;
  }

  public getSecretJson(imageSourceId: string) {
    const secret =
`{
  "sourceId": "${imageSourceId}",
  "token": "${this.selectedToken && this.selectedToken.value}",
}
`;
    return secret;
  }

  public onSelectToken(token) {
    this.selectedToken = token;
  }

}
