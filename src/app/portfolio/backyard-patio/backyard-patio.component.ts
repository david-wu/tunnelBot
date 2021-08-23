import {
  Component,
} from '@angular/core';

@Component({
  selector: 'dwu-backyard-patio',
  templateUrl: './backyard-patio.component.html',
  styleUrls: ['./backyard-patio.component.scss'],
})
export class BackyardPatioComponent {
  public tileIds = [
    '20200425_103623',
    '20200425_103629',
    '20200726_161356',
    '20200727_182054',
    '20200728_093921',
    '20200729_100937',
    '20200801_103249',
    '20200803_093712',
    '20200803_100656',
    '20200803_133722',
    '20200803_142142',
    '20200803_195323',
    '20200804_214359',
    '20200804_214805',
    '20200805_201423',
    '20200812_135003',
    '20200812_153652',
    '20200813_114158',
    '20200926_120644',
    '20201012_181354',
    '20201101_110541',
    '20201101_110551',
    '20201107_094059',
    '20201107_094105',
    '20201109_130902',
    '20201126_220433',
    '20201210_154146',
  ];

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

  public zoomLevel = 5;
  public alwaysUseMaxColumns = true;
  public centeredTileId;

  public suffixByMaxWidth = {
    80: '_xs.jpg',
    160: '_ss.jpg',
    320: '_sm.jpg',
    640: '_md.jpg',
    1080: '_lg.jpg',
  };
  public magnifiedImage;

  public getImgSrc(tileId, maxWidth) {
    const imageIdx = Number(tileId.split('_')[1]);
    const imgBase = `assets/images/backyard-patio/${tileId}`;
    const suffix = this.suffixByMaxWidth[maxWidth];
    return imgBase + suffix;
  }

  // public zoomIn() {
  //   this.maxColumns = Math.max(1, this.maxColumns - 1);
  // }

  // public zoomOut() {
  //   this.maxColumns = Math.min(10, this.maxColumns + 1);
  // }

  // public getSmSrc(image) {
  //   return `${image.path}_sm.jpg`;
  // }

  // public getLgSrc(image) {
  //   return `${image.path}_lg.jpg`;
  // }
}
