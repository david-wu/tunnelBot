import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import { keyBy } from 'lodash';

import { File, FileGroup } from '@file-explorer/index';

@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {

  public filesById: Record<string, File> = {};
  public filesByLabel: Record<string, File> = {};
  public fileGroup: FileGroup = new FileGroup();
  public filterStr = '';
  public leftSideExpanded = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
  ) {
    this.populateFileGroup();
    this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        const activatedChild = routerEvent.urlAfterRedirects.split('/')[2];
        this.fileGroup.setSelectedFileIds(new Set([activatedChild]));
      }
    });
  }

  public populateFileGroup() {
    const fileDataById = {
      id: 'PROJECTS',
      label: 'Projects',
      childrenById: {
        BACKYARD_PATIO: {
          label: 'backyard patio',
        },
        COVID_DEMO: {
          label: 'covid tracker',
        },
        FUZZ: { label: 'fuzz-js' },
        PHOTO_APP: { label: 'photo app' },
        PICTURE_PIPER: { label: 'picture piper' },
        COMPONENTS: {
          label: 'components',
          childrenById: {
            FILE_EXPLORER: { label: 'file-explorer' },
            VIRTUAL_SCROLL_GRID: { label: 'virtual-scroll-grid'},
            CODE_SNIPPET: { label: 'code-snippet' },
            CHARTS_DIR: {
              label: 'charts',
              childrenById: {
                // FLEX_CHART: { label: 'flex chart' },
                LINE_CHART: { label: 'line chart' },
                BAR_CHART: { label: 'bar chart' },
                CHART_LEGEND: { label: 'chart legend' },
                TOOLTIP: { label: 'tooltip' },
              },
            },
          },
        },
        TODOS: {
          label: 'todos',
          childrenById: {
            MARKDOWN: { label: 'support markdown-editor' },
            FAVICON: { label: 'make a favicon' },
            COMMON: { label: 'components demos' },
            PHOTOS: {
              label: 'photo app todo',
              childrenById: {
                TD1: { label: 'upload photo transaction' },
                TD2: { label: 'service worker' },
                TD3: { label: 'walk/bike/car distance' },
                TD4: { label: 'better models/interfaces' },
                TD5: { label: 's2' },
                TD6: { label: 's4' },
                TD7: { label: 'sort by distance' },
                TD8: { label: 'map with nearby pics' },
                TD9: { label: 'tensorflow, auto label pics' },
                TD10: { label: 'oaktown pics' },
              },
            },
          },
        },
      },
    };

    const files = this.fileGroup.filesByIdFromJson(fileDataById);
    this.filesById = keyBy(files, 'id');

    this.fileGroup.setRootFile(this.filesById.PROJECTS);
    this.fileGroup.setClosedFileIds(new Set(['TODOS']));
  }

  public getSelectedFileId() {
    const selectedFileIds = Array.from(this.fileGroup.selectedFileIds || []);
    return (selectedFileIds.length === 1) && selectedFileIds[0];
  }

  public onSelectedFileIdsChange(fileIds) {
    const fileId = Array.from(fileIds)[0];
    if (fileId) {
      this.router.navigate([fileId], { relativeTo: this.route });
    }
  }

}
