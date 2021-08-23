import { Component, ElementRef } from '@angular/core';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import {
    each,
    isString,
    set,
} from 'lodash';

import jhFileNames from '@src/assets/jh-corona/file-names.json';
import lockdownDataByLocation from '@src/assets/jh-corona/lockdown-data-by-file-name.json';

import { File, FileGroup } from '@file-explorer/index';
import { NormalKeys } from '@src/app/corona/models/index';
import { LocalStorageService } from '@src/app/corona/services/local-storage.service';

enum Tab {
    ALL = 'ALL',
    SAVED = 'SAVED',
    COMPARE = 'COMPARE',
}

@Component({
  selector: 'dwu-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.scss']
})
export class CoronaComponent {

    public fileGroup: FileGroup = new FileGroup();
    public locationsByFileId: Record<string, string> = {};
    public fileIdsByLocation: Record<string, string> = {};
    public locationRoot: File;
    public favoritesRootId: string;
    public favoriteFileIds: Set<string> = new Set();
    public filterStr = '';
    public disabledBarKeys = new Set<string>();
    public disabledNormalKeys = new Set<string>([NormalKeys.R]);
    public isViewingNormalized = false;
    public isViewingLineChart = false;
    public selectedTab: Tab;
    public compareSelectedFileIds = new Set<string>();
    public closedFileIdsWhileQuery = new Set<string>();
    public leftSideExpanded = false;
    public sensor;
    public narrowMode;

    public readonly Tab = Tab;
    public readonly lockdownDataByLocation = lockdownDataByLocation;

    /**
     * ngOnInit
     */
    constructor(
        public localStorageService: LocalStorageService,
        public hostEl: ElementRef,
    ) {
        this.populateFileGroup();
        this.fileGroup.closeAllFolders();
        this.fileGroup.closedFileIds.delete(this.favoritesRootId);
        this.fileGroup.closedFileIds.delete(this.locationRoot.id);
        this.loadFavorites();
        this.setSelectedTab(Tab.SAVED);
    }

    public ngOnInit() {
      this.setNarrowModeClass();
      this.sensor = new ResizeSensor(this.hostEl.nativeElement, () => this.setNarrowModeClass());
    }

    public ngOnDestroy() {
      this.sensor.detach();
    }

    public setNarrowModeClass() {
      this.narrowMode = this.hostEl.nativeElement.clientWidth <= 750;
      this.hostEl.nativeElement.className = this.narrowMode ? 'narrow-mode' : '';
    }

    public onSelectedFileIdsChange(selectedFileIds: Set<string>) {
        if (this.selectedTab === Tab.COMPARE) {
            this.compareSelectedFileIds = selectedFileIds;
        } else {
            this.fileGroup.setSelectedFileIds(selectedFileIds);
        }
    }

    public setSelectedTab(tab: Tab) {
        this.selectedTab = tab;
        if (tab === Tab.SAVED) {
            this.fileGroup.rootFileId = this.favoritesRootId;
        } else if (tab === Tab.ALL) {
            this.fileGroup.setRootFile(this.locationRoot);
        } else if (tab === Tab.COMPARE) {
            this.fileGroup.setRootFile(this.locationRoot);
        }
        this.filterStr = '';
    }


    public onFilterStringChange(filterStr: string) {
        if (filterStr && this.selectedTab === Tab.SAVED) {
            this.setSelectedTab(Tab.ALL);
        }
        this.filterStr = filterStr;
    }

    public loadFavorites() {
        const favoriteLocations = this.localStorageService.getFavoriteLocations();
        const favoriteIds = favoriteLocations.map((location: string) => this.fileIdsByLocation[location]);
        this.fileGroup.filesById[this.favoritesRootId].childIds = favoriteIds;
        this.favoriteFileIds = new Set(favoriteIds);
        this.compareSelectedFileIds = new Set(favoriteIds);
        if (favoriteIds.length) {
            this.fileGroup.setSelectedFileIds(new Set([favoriteIds[0]]));
        }
    }

    public saveFavorites() {
        const locations = this.fileGroup.filesById[this.favoritesRootId].childIds
            .map((fileId: string) => this.locationsByFileId[fileId]);
        this.localStorageService.setFavoriteLocations(locations);
    }

    public toggleFavoriteFile(file: File, event: Event) {
        event.stopPropagation();
        if (this.favoriteFileIds.has(file.id)) {
            this.favoriteFileIds.delete(file.id);
            this.fileGroup.removeAsChildId(this.favoritesRootId, file.id);
        } else {
            this.favoriteFileIds.add(file.id);
            this.fileGroup.addAsChildId(this.favoritesRootId, file.id);
        }
        this.saveFavorites();
        this.fileGroup.flushFileChanges();
    }

    /**
     * populateFileGroup
     * Puts data from coronaLocations into fileGroup
     */
    public populateFileGroup() {
        const jhFileNameSet = new Set<string>(jhFileNames);
        this.locationRoot = this.fileGroup.createFile({ label: 'World' });
        const favoritesRoot = this.fileGroup.createFile({ label: 'Favorites', childIds: [] });
        this.favoritesRootId = favoritesRoot.id;
        // const nestedCoronaLocations = this.getNestedCoronaLocations(coronaLocations);
        const nestedCoronaLocations = this.getNestedJhCoronaLocations(jhFileNames);
        // setFileGroupNested batches file creations, make sure to flush
        this.setFileGroupNested(this.locationRoot, nestedCoronaLocations, jhFileNameSet);
        this.fileGroup.flush();
    }

    public getNestedJhCoronaLocations(jhFileNames) {
        const nestedJhCoronaFileNames = {};
        jhFileNames.sort((a, b) => a.length - b.length);
        jhFileNames.forEach((fileName: string) => {
            const splitLocation = fileName.split('_');
            set(nestedJhCoronaFileNames, splitLocation, fileName);
        });
        return nestedJhCoronaFileNames;
    }

    /**
     * setFileGroupNested
     * Uses the nestedLocations to create files in this.fileGroup
     * Also sets locationsByFileId for referencing files later on.
     * @param {File} file
     * @param {any}  nestedLocations
     */
    public setFileGroupNested(file: File, nestedLocations: any, jhFileNameSet: Set<string>, path = []) {
        const fileName = path.join('_');
        if (jhFileNameSet.has(fileName)) {
            this.locationsByFileId[file.id] = fileName;
            this.fileIdsByLocation[fileName] = file.id;
        }
        if (isString(nestedLocations)) {
            return;
        }
        const locations = Object.keys(nestedLocations).sort();
        each(locations, (location: string) => {
            // batchCreateFile is more performant, make sure to flush
            const label = location.replace(/-/g, ' ')
                .replace(/\*/g, '');

            const childNode = this.fileGroup.batchCreateFile({
                label,
            });
            this.fileGroup.batchAddAsChild(file, childNode);
            this.setFileGroupNested(childNode, nestedLocations[location], jhFileNameSet, [...path, location]);
        });
    }

    public onFilesByIdChange(filesById: Record<string, File>) {
        this.fileGroup.filesById = filesById;
        this.saveFavorites();
    }

    public getSelectedFileIds() {
        return (this.selectedTab === Tab.COMPARE) ? this.compareSelectedFileIds : this.fileGroup.selectedFileIds;
    }

}
