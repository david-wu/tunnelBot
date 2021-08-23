
import { CoronaStoreService } from '@src/app/corona/services/corona-store.service';
import { CoronaService } from '@src/app/corona/services/corona.service';
import { LocalStorageService } from '@src/app/corona/services/local-storage.service';

export const SERVICES = [
    CoronaStoreService,
    CoronaService,
    LocalStorageService,
];

export * from './corona-store.service';
export * from './corona.service';
export * from './local-storage.service';
