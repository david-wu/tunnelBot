import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { reverseBreadthFirstBy } from '@utils/index';
import {
  Fuzz,
  FuzzItem,
} from 'fuzz-js';
import {
  each,
  includes,
  isUndefined,
  last,
  uniq,
  without,
} from 'lodash';
import { DragulaService } from 'ng2-dragula';

import {
  File,
} from '@src/app/common/file-explorer/models/index';

@Component({
  selector: 'dwu-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
  providers: [
    DragulaService,
  ],
})
export class FileExplorerComponent {
  @Input() rootFileId: string;
  @Input() fuzzFilterString = '';
  @Input() filesById: Record<string, File>;
  @Input() closedFileIds: Set<string> = new Set();
  @Input() selectedFileIds: Set<string> = new Set<string>();
  @Input() perfMode = true;
  @Input() rowIconTemplate?: TemplateRef<any>;
  @Input() hideRoot = true;
  @Input() multiFileSelect = false;
  @Input() dragEnabled = false;
  @Input() disableOpening = false;
  @Input() filterThreshold = 0.6;
  @Output() filesByIdChange = new EventEmitter<Record<string, File>>();
  @Output() closedFileIdsChange = new EventEmitter<Set<string>>();
  @Output() selectedFileIdsChange = new EventEmitter<Set<string>>();

  @Input() initialScrollToId: string;
  @ViewChildren(CdkVirtualScrollViewport) scrollViewport: QueryList<CdkVirtualScrollViewport>;

  public parentIdsByFileId: Record<string, string>;
  public fuzzItemsByFileId: Record<string, FuzzItem> = {};
  public fileIdsAndDepth: Array<[string, number]> = [];
  public visibleFileIds: Set<string> = new Set<string>();
  public fileIsOddById: Record<string, boolean> = {};
  public sensor;
  private subs = new Subscription();

  public fileIdBeingDragged: string;

  constructor(
    public dragulaService: DragulaService,
    public hostEl: ElementRef,
  ) {
    const drakeGroup = dragulaService.createGroup('EXP', {
      isContainer: (el) => {
        if (this.disableOpening) {
          return false;
        }
        const fileId = el.getAttribute('data-file-id');
        return Boolean(fileId && this.filesById[fileId] && this.filesById[fileId].childIds);
      },
      moves: (el, container, handle) => {
        return this.dragEnabled && handle.classList.contains('dragula-handle');
      },
      revertOnSpill: false,
    });

    this.subs.add(this.dragulaService.drop('EXP')
      .subscribe((drop) => {
        // use on our own dom manipulation
        drakeGroup.drake.cancel(true);

        // If there is a target container, just add it in
        if (this.getElFileId(drop.target)) {
          this.addFileToFileChildren(
            this.getElFileId(drop.el),
            this.getElFileId(drop.target),
          );
          return;
        }

        // If there is a sibling, insert it before the sibling
        if (drop.sibling && this.getElFileId(drop.sibling)) {
          this.insertFileBeforeFile(
            this.getElFileId(drop.el),
            this.getElFileId(drop.sibling),
          );
          // If there is NO sibling, it was dropped at the bottom, insert at end
        } else {
          const lastVisibleFileId = last(this.fileIdsAndDepth)[0];
          this.insertFileAfterFile(
            this.getElFileId(drop.el),
            lastVisibleFileId,
          );
        }
      }),
    );

    this.subs.add(this.dragulaService.over('EXP')
      .subscribe(({ el }) => {
        // if a folder is being dragged isContainer function will return true
        // this makes 'el' be the childElement so I also check the parentNode's attribute
        const nextFileIdBeingDragged = this.getElFileId(el);

        // for the first over event after a dragend, el is the element being dragged
        if (!this.fileIdBeingDragged && (this.fileIdBeingDragged !== nextFileIdBeingDragged)) {
          this.fileIdBeingDragged = nextFileIdBeingDragged;
          this.closedFileIdsChange.emit(new Set([
            ...this.closedFileIds,
            this.fileIdBeingDragged,
            ]));
        }
      }),
    );

    this.subs.add(this.dragulaService.dragend('EXP')
      .subscribe(() => this.fileIdBeingDragged = undefined),
    );

  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.rootFileId || changes.filesById || changes.closedFileIds || changes.fuzzFilterString || changes.perfMode) {
      if (this.rootFileId && this.filesById) {
        this.setTableIndices();
      }
    }
    if (changes.fuzzFilterString
      && this.fuzzFilterString
      && this.scrollViewport
      && this.scrollViewport.first
    ) {
      this.scrollViewport.first.scrollToIndex(0);
    }

    // Scroll back to selected if queryString is removed
    if (changes.fuzzFilterString
      && changes.fuzzFilterString.previousValue
      && !this.fuzzFilterString
      && this.scrollViewport
      && this.scrollViewport.first
    ) {
      this.scrollToSelectedFileId();
    }
  }

  public ngAfterViewInit() {
    this.subs.add(this.scrollViewport.changes.pipe(take(1))
      .subscribe(() => this.scrollToSelectedFileId()),
    );
    this.sensor = new ResizeSensor(this.hostEl.nativeElement, () => {
      if (this.scrollViewport && this.scrollViewport.first) {
        this.scrollViewport.first.checkViewportSize();
      }
    });
  }

  public ngOnDestroy() {
    this.subs.unsubscribe();
    this.dragulaService.destroy('EXP');
    this.sensor.detach();
  }

  public scrollToSelectedFileId() {
    const viewPort = this.scrollViewport && this.scrollViewport.first;
    if (!viewPort) {
      return;
    }
    const firstSelectedFileId = Array.from(this.selectedFileIds)[0];
    const filePosition = this.getFileIdPosition(firstSelectedFileId);
    // leave some space above file to show you can scroll up
    const scrollPosition = Math.max(0, filePosition - 2);

    // weird issue with cdk needs timeout
    setTimeout(() => {
      viewPort.scrollToIndex(scrollPosition);
    });
  }

  public insertFileAfterFile(fileId1: string, fileId2: string) {
    const changes = {};
    each(this.filesById, (file: File) => {
      if (includes(file.childIds, fileId1)) {
        changes[file.id] = Object.assign(new File(), {
          ...file,
          childIds: without(file.childIds, fileId1),
        });
      }
    });

    const insertParent = this.filesById[this.parentIdsByFileId[fileId2]];
    const nextChildIds = without(insertParent.childIds, fileId1);
    // const insertionIndex = nextChildIds.indexOf(fileId2);
    nextChildIds.push(fileId1);

    changes[insertParent.id] = Object.assign(new File(), {
      ...insertParent,
      childIds: nextChildIds,
    });
    this.filesByIdChange.emit({
      ...this.filesById,
      ...changes,
    });
  }

  public insertFileBeforeFile(fileId1, fileId2) {
    if (fileId2 === this.rootFileId) {
      return;
    }

    const changes = {};
    each(this.filesById, (file: File) => {
      if (includes(file.childIds, fileId1)) {
        changes[file.id] = Object.assign(new File(), {
          ...file,
          childIds: without(file.childIds, fileId1),
        });
      }
    });

    const insertParent = this.filesById[this.parentIdsByFileId[fileId2]];
    const nextChildIds = without(insertParent.childIds, fileId1);
    const insertionIndex = nextChildIds.indexOf(fileId2);
    nextChildIds.splice(insertionIndex, 0, fileId1);

    changes[insertParent.id] = Object.assign(new File(), {
      ...insertParent,
      childIds: nextChildIds,
    });
    this.filesByIdChange.emit({
      ...this.filesById,
      ...changes,
    });
  }

  public addFileToFileChildren(fileId1, fileId2) {
    const changes = {};
    each(this.filesById, (file: File) => {
      if (includes(file.childIds, fileId1)) {
        changes[file.id] = Object.assign(new File(), {
          ...file,
          childIds: without(file.childIds, fileId1),
        });
      }
    });

    // empty fileId2 means insert after the last element
    if (fileId2) {
      const parentFile = this.filesById[fileId2];
      changes[parentFile.id] = Object.assign(new File(), {
        ...this.filesById[parentFile.id],
        childIds: uniq([fileId1, ...parentFile.childIds]),
      });
    } else {
      const parentFile = this.filesById[this.rootFileId];
      changes[parentFile.id] = Object.assign(new File(), {
        ...this.filesById[parentFile.id],
        childIds: uniq([...parentFile.childIds, fileId1]),
      });
    }

    this.filesByIdChange.emit({
      ...this.filesById,
      ...changes,
    });
  }

  public getParentIdsByFileId(fileId: string, filesById: Record<string, File>) {
    const file = filesById[fileId];
    const parentIdsByFileId = {};

    each(file.childIds, (childId: string) => {
      parentIdsByFileId[childId] = fileId;
      const innerParentIdsByFileId = this.getParentIdsByFileId(childId, filesById);
      each(innerParentIdsByFileId, (parentId: string, grandChildId: string) => {
        parentIdsByFileId[grandChildId] = parentId;
      });
    });
    return parentIdsByFileId;
  }

  public setTableIndices() {
    this.parentIdsByFileId = this.getParentIdsByFileId(this.rootFileId, this.filesById);
    if (!this.fuzzFilterString) {
      this.fuzzItemsByFileId = {};
      this.visibleFileIds = this.getVisibleFileIds(
        this.rootFileId,
        this.filesById,
        this.closedFileIds,
        );
      this.fileIdsAndDepth = this.getFileIdsAndDepth(
        this.rootFileId,
        this.filesById,
        undefined,
        this.disableOpening ? -1 : Infinity,
        );
      this.fileIsOddById = this.getFileIsOddById(this.fileIdsAndDepth, this.visibleFileIds);
    } else {
      this.fuzzItemsByFileId = this.getFuzzResultsByFileId(this.fuzzFilterString, this.filesById);

      // maxScore is the highest score between the item and all its descendants
      // low max scores will get filtered out
      const {
        maxScoresByFileId,
        sortedChildIdsByFileId,
      } = this.sortFileIndexChildren(this.filesById, this.fuzzItemsByFileId);

      this.visibleFileIds = this.getVisibleFileIds(
        this.rootFileId,
        this.filesById,
        new Set(), // no closed folders while searching
        maxScoresByFileId,
        );
      this.fileIdsAndDepth = this.getFileIdsAndDepth(
        this.rootFileId,
        this.filesById,
        sortedChildIdsByFileId,
        this.disableOpening ? -1 : Infinity,
        );
      this.fileIsOddById = this.getFileIsOddById(this.fileIdsAndDepth, this.visibleFileIds);
    }
  }

  public getFuzzResultsByFileId(
    filterString: string,
    filesById: Record<string, File>,
    ): Record<string, FuzzItem> {
    const fileList = Object.keys(filesById).map((fileId: string) => filesById[fileId]);
    const fuzzResults = Fuzz.search(
      fileList,
      filterString,
      {
        disableDiagnostics: true,
        disableStyledString: true,
        subjectKeys: ['label'],
      },
    );
    const fuzzItemsByFileId = {};
    fuzzResults.forEach((fuzzItem: FuzzItem) => {
      fuzzItemsByFileId[fuzzItem.original.id] = fuzzItem;
    });
    return fuzzItemsByFileId;
  }

  /**
  * sortFileIndexChildren
  * Sorts the childIds for a file tree
  * avoids modifying filesById
  * @param {Record<string, File>} filesById
  * @param {Set<string>} fileIdsToKeep
  */
  public sortFileIndexChildren(filesById: Record<string, File>, fuzzItemsById: Record<string, FuzzItem>) {
    const maxScoresByFileId = {};
    const sortedChildIdsByFileId = {};
    reverseBreadthFirstBy(
      this.rootFileId,
      (fileId: string) => {
        const file = filesById[fileId];
        return (file && file.childIds) ? file.childIds : [];
      },
      (fileId: string) => {
        const file = filesById[fileId];
        const fuzzItem = fuzzItemsById[fileId];
        maxScoresByFileId[fileId] = fuzzItem ? fuzzItem.score : 0;
        if (!file.childIds) {
          return;
        }
        // maxScoresByFileId maintains the highest score for the file and all its children
        const childMaxScores = file.childIds.map((childId: string) => maxScoresByFileId[childId]);
        maxScoresByFileId[file.id] = Math.max(
          maxScoresByFileId[file.id],
          ...childMaxScores,
          );
        sortedChildIdsByFileId[file.id] = [...file.childIds]
          .sort((id1: string, id2: string) => maxScoresByFileId[id2] - maxScoresByFileId[id1]);
      },
      );
    return {
      maxScoresByFileId,
      sortedChildIdsByFileId,
    };
  }

  /**
  * getFileIdsAndDepth
  * if sortedChildIdsByFileId is passed, it overrides the childIds in filesById
  * this is used when fuzzy filtering and the children are in a different order
  * @param  {string} currentFileId
  * @param  {Record<string, File>} filesById
  * @param  {Record<string, string[]>} sortedChildIdsByFileId
  * @param  {number} depth
  * @return {Array}
  */
  public getFileIdsAndDepth(
    currentFileId: string,
    filesById: Record<string, File>,
    sortedChildIdsByFileId: Record<string, string[]>,
    maxDepth: number,
    depth: number = 0,
  ): Array<[string, number]> {
    // don't animate stuff, use virtual scroll viewport
    if (this.perfMode && !this.visibleFileIds.has(currentFileId)) {
      return [];
    }
    const currentFile = filesById[currentFileId];
    const fileIdsAndDepth: Array<[string, number]> = [
      [currentFileId, depth],
    ];
    if (this.hideRoot && currentFileId === this.rootFileId) {
      fileIdsAndDepth.length = 0;
      depth--;
    }
    if (depth > maxDepth) {
      return fileIdsAndDepth;
    }

    each(
      sortedChildIdsByFileId ? sortedChildIdsByFileId[currentFile.id] : currentFile.childIds,
      (childId: string) => {
        const childFileIdsAndDepth = this.getFileIdsAndDepth(
          childId,
          filesById,
          sortedChildIdsByFileId,
          maxDepth,
          depth + 1,
          );
        fileIdsAndDepth.push(...childFileIdsAndDepth);
      },
    );
    return fileIdsAndDepth;
  }

  public getVisibleFileIds(
    currentFileId: string,
    filesById: Record<string, File>,
    closedFileIds: Set<string>,
    maxScoresByFileId: Record<string, number> = {},
  ): Set<string> {
    const currentFile = filesById[currentFileId];
    const currentMaxScore = isUndefined(maxScoresByFileId[currentFileId]) ? 1 : maxScoresByFileId[currentFileId];
    const visibleFileIds = new Set<string>();
    if (currentMaxScore > this.filterThreshold) {
      visibleFileIds.add(currentFile.id);
    }
    if (!closedFileIds.has(currentFileId)) {
      each(currentFile.childIds, (childId: string) => {
        const childVisibleFileIds = this.getVisibleFileIds(
          childId,
          filesById,
          closedFileIds,
          maxScoresByFileId,
        );
        childVisibleFileIds.forEach((visibleFileId: string) => visibleFileIds.add(visibleFileId));
      });
    }
    return visibleFileIds;
  }

  public getFileIsOddById(fileIdsAndDepth: Array<[string, number]>, visibleFileIds: Set<string>) {
    const fileIsOddById = {};
    let isOdd = false;
    for (let i = 0; i < fileIdsAndDepth.length; i++) {
      const fileId = fileIdsAndDepth[i][0];
      if (visibleFileIds.has(fileId)) {
        isOdd = !isOdd;
      }
      fileIsOddById[fileId] = isOdd;
    }
    return fileIsOddById;
  }

  public toggleClosedFile(file: File, event: Event) {
    event.stopPropagation();
    this.closedFileIds = new Set(this.closedFileIds);
    if (this.closedFileIds.has(file.id)) {
      this.closedFileIds.delete(file.id);
    } else {
      this.closedFileIds.add(file.id);
    }
    this.closedFileIdsChange.emit(this.closedFileIds);
  }

  public selectFile(file: File) {
    if (!this.multiFileSelect) {
      this.selectedFileIdsChange.emit(new Set([file.id]));
    } else {
      const nextSelectedFileIds = new Set(this.selectedFileIds);
      if (nextSelectedFileIds.has(file.id)) {
        nextSelectedFileIds.delete(file.id);
      } else {
        nextSelectedFileIds.add(file.id);
      }
      this.selectedFileIdsChange.emit(nextSelectedFileIds);
    }
  }

  public getPaddingLeft(depth: number) {
    if (this.disableOpening) {
      return '0.25rem';
    }
    return `${depth}rem`;
  }

  public trackByFn(fileIdAndDepth: [string, number]) {
    return fileIdAndDepth[0];
  }

  public getFileIdPosition(fileId: string) {
    return Math.max(
      this.fileIdsAndDepth.findIndex((idAndDepth: [string, number]) => idAndDepth[0] === fileId),
      0,
      );
  }

  public getElFileId(el) {
    if (!el) {
      return;
    }
    return el.getAttribute('data-file-id') || el.parentNode.getAttribute('data-file-id');
  }

}
