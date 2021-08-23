import {
  Component,
} from '@angular/core';
import { File } from '@file-explorer/index';


@Component({
  selector: 'dwu-file-explorer-demo',
  templateUrl: './file-explorer-demo.component.html',
  styleUrls: ['./file-explorer-demo.component.scss'],
})
export class FileExplorerDemoComponent {
  public filesById: Record<string, File> = {
    file1: Object.assign(new File(), {
      id: 'file1',
      label: 'file1',
      childIds: ['file2', 'file3'],
    }),
    file2: Object.assign(new File(), {
      id: 'file2',
      label: 'work stuff',
      childIds: ['file4', 'file5'],
    }),
    file3: Object.assign(new File(), {
      id: 'file3',
      label: 'covid stuff',
      childIds: [],
    }),
    file4: Object.assign(new File(), {
      id: 'file4',
      label: 'file4',
    }),
    file5: Object.assign(new File(), {
      id: 'file5',
      label: 'file5',
      childIds: ['file6'],
    }),
    file6: Object.assign(new File(), {
      id: 'file6',
      label: 'file6',
    }),
  };
  public closedFileIds = new Set();
  public selectedFileIds = new Set();
  public filterStr = '';
  public fileExplorerUsage =
`<dwu-file-explorer
  [rootFileId]="'file1'"
  [filesById]="filesById"
  [(closedFileIds)]="closedFileIds"
  [(selectedFileIds)]="selectedFileIds"
  [fuzzFilterString]="filterStr"
  [multiFileSelect]="true"
></dwu-file-explorer>`;

  public onFilesByIdChange() {

  }
}

const lineChartHtml =
`<dwu-file-explorer
  [tableData]="demoData"
  [keys]="demoKeys"
  [hoverIndex]="hoverIndex"
  (hoverIndexChange)="hoverIndex = $event"
></dwu-file-explorer>`;

