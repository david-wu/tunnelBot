import {
  Component,
} from '@angular/core';
import { times } from 'lodash';

@Component({
  selector: 'dwu-virtual-scroll-grid-demo',
  templateUrl: './virtual-scroll-grid-demo.component.html',
  styleUrls: ['./virtual-scroll-grid-demo.component.scss'],
})
export class VirtualScrollGridDemoComponent {

  public maxColumns = 3;
  public tileIds: string[] = times(5000, (idx) => {
    const imageIndex = Math.floor(Math.random() * 5);
    return `${idx}_${imageIndex}`;
  });
  public alwaysUseMaxColumns = false;
  public centeredTileId: string;
  // maxColumns is used as a bound to bump up to the next tileOption
  // larger tile width is preferred
  public readonly tileOptions = [
    {
      maxWidth: 80,
      aspectRatio: 4 / 3,
    },
    {
      maxWidth: 160,
      aspectRatio: 4 / 3,
    },
    {
      maxWidth: 320,
      aspectRatio: 4 / 3,
    },
    {
      maxWidth: 640,
      aspectRatio: 4 / 3,
    },
    {
      maxWidth: 1080,
      aspectRatio: 4 / 3,
    },
  ];
  public readonly images = [
    'assets/images/grid-demo-pics/1',
    'assets/images/grid-demo-pics/2',
    'assets/images/grid-demo-pics/3',
    'assets/images/grid-demo-pics/4',
    'assets/images/grid-demo-pics/5',
  ];
  public readonly suffixByMaxWidth = {
    80: '_xs.jpg',
    160: '_ss.jpg',
    320: '_sm.jpg',
    640: '_md.jpg',
    1080: '_lg.jpg',
  };

  public getImgSrc(tileId, maxWidth) {
    const imageIdx = Number(tileId.split('_')[1]);
    const imgBase = this.images[imageIdx];
    const suffix = this.suffixByMaxWidth[maxWidth];
    return imgBase + suffix;
  }
}
