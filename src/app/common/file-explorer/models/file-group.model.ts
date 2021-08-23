
import { File } from '@src/app/common/file-explorer/models/file.model';
import { breadthFirstBy, reverseBreadthFirstBy } from '@utils/index';
import {
  each,
  keyBy,
  map,
  mapValues,
  some,
  uniq,
  uniqueId,
  values,
} from 'lodash';

export class FileGroup {
  public rootFileId: string;
  public filesById: Record<string, File> = {};
  public closedFileIds: Set<string> = new Set();
  public selectedFileIds: Set<string> = new Set<string>();

  public static createWithRoot(rootId: string) {
    const fileGroup = new FileGroup();
    const root = fileGroup.createFile({ label: 'World' });
    fileGroup.setRootFile(root);
    return fileGroup;
  }

  constructor(public seed = uniqueId('dfg_')) {}

  /**
   * filesByIdFromJson
   * handy when declaring files using a nested structure
   * @param {any} fileData
   */
   public filesByIdFromJson(fileData: any) {
     const files = [];
     breadthFirstBy(
       fileData,
       (parent) => {
         const childFiles = mapValues(parent.childrenById, (childFile: any, fileId: string) => {
           return {
             label: fileId,
             id: fileId,
             ...childFile,
           };
         });
         return values(childFiles);
       },
       (file) => {
         const partialFile = { ...file };
         delete partialFile.childrenById;

         if (file.childrenById) {
           const childIds = Object.keys(file.childrenById || {});
           files.push(this.createFile({
             ...partialFile,
             childIds,
           }));
         } else {
           files.push(this.createFile(partialFile));
         }
       },
     );
     return files;
   }

  /**
   * focusOnSelected
   * close all folders then open all the parents of selected so that it's visible
   */
   public focusOnSelected() {
     this.closeAllFolders();
     const openFileIds = new Set<string>();
     const selectedFileIds = Array.from(this.selectedFileIds);

     selectedFileIds.forEach((fileId: string) => openFileIds.add(fileId));
     reverseBreadthFirstBy(
       this.rootFileId,
       (fileId: string) => this.filesById[fileId].childIds || [],
       (fileId: string) => {
         const file = this.filesById[fileId];
         if (some(file.childIds, (childId: string) => openFileIds.has(childId))) {
           openFileIds.add(file.id);
         }
       },
       );

     Array.from(openFileIds).forEach((openFileId: string) => {
       const openFile = this.filesById[openFileId];
       if (openFile.childIds) {
         this.closedFileIds.delete(openFile.id);
       }
     });
   }

  /**
   * closeAllFolders
   */
   public closeAllFolders() {
     this.closedFileIds = new Set();
     each(this.filesById, (file: File) => {
       if (file.childIds) {
         this.closedFileIds.add(file.id);
       }
     });
   }

  /**
   * setSelectedFileIds
   * @param {Set<string>} fileIds
   */
   public setSelectedFileIds(fileIds: Set<string>) {
     this.selectedFileIds = fileIds;
   }

  public getSelectedFileId() {
    return Array.from(this.selectedFileIds)[0];
  }

  /**
   * setRootFile
   * @param {File} file
   */
   public setRootFile(file: File) {
     this.rootFileId = file.id;
   }

  /**
   * setClosedFileIds
   * @param {Set<string>} closedFileIds
   */
   public setClosedFileIds(closedFileIds: Set<string>) {
     this.closedFileIds = closedFileIds;
   }

   public removeAsChildId(parentId: string, childId: string) {
     const parent = this.filesById[parentId];
     const child = this.filesById[childId];
     this.removeAsChild(parent, child);
   }

   public removeAsChild(parent: File, child: File) {
     parent.childIds = parent.childIds.filter((childId: string) => childId !== child.id);
   }

   public addAsChildId(parentId: string, childId: string) {
     const parent = this.filesById[parentId];
     const child = this.filesById[childId];
     this.addAsChild(parent, child);
   }

  /**
   * addAsChild
   * @param {File} parent
   * @param {File} child
   */
   public addAsChild(parent: File, child: File) {
     parent.childIds = uniq([...(parent.childIds || []), child.id]);
   }

  /**
   * batchAddAsChild
   * more performant version of addAsChild, make sure to flush!
   * @param {File} parent
   * @param {File} child
   */
   public batchAddAsChild(parent: File, child: File) {
     if (parent.childIds) {
       parent.childIds.push(child.id);
     } else {
       parent.childIds = [child.id];
     }
   }

  /**
   * flushFileChanges
   * new reference for childIds so change detection will pick up on batchAddAsChild
   */
   public flushBatchAddAsChild() {
     each(this.filesById, (file: File) => {
       file.childIds = file.childIds && uniq(file.childIds);
     });
   }

  /**
   * createFile
   * @param  {Partial<File>} overrides
   * @return {File}
   */
   public createFile(overrides: Partial<File> = {}): File {
     const uniqueId = this.getUniqueId();
     const newFile = Object.assign(new File(), {
       id: uniqueId,
       label: uniqueId,
       ...overrides,
     });
     this.filesById = {
       ...this.filesById,
       [newFile.id]: newFile,
     };
     return newFile;
   }

  /**
   * batchCreateFile
   * this.createFile replaces this.filesById for change detection
   * this is very slow when creating a lot of files
   * batchCreateFile modifies filesById, then flushFileChanges replaces this.filesById
   * @param  {Partial<File> = {}} overrides
   * @return {File}
   */
   public batchCreateFile(overrides: Partial<File> = {}): File {
     const uniqueId = this.getUniqueId();
     const newFile = Object.assign(new File(), {
       id: uniqueId,
       label: uniqueId,
     }, overrides);
     this.filesById[newFile.id] = newFile;
     return newFile;
   }

  /**
   * flushFileChanges
   * new reference for filesById so change detection will pick up on batchCreateFile
   */
   public flushFileChanges() {
     this.filesById = {...this.filesById};
   }

  /**
   * flush
   */
   public flush() {
     this.flushFileChanges();
     this.flushBatchAddAsChild();
   }

  /**
   * getUniqueId
   * @return {string}
   */
  public getUniqueId(): string {
    while (true) {
      const id = uniqueId(this.seed);
      if (!this.filesById[id]) {
        return id;
      }
    }
  }

  /**
   * setRootChildren
   */
  public setRootChildren(files: File[]) {
    const rootFile = this.filesById[this.rootFileId];
    rootFile.childIds = map(files, 'id');
    this.filesById = keyBy([rootFile, ...files], 'id');
  }

}
