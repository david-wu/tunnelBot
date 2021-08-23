
import { Injectable } from '@angular/core';
import {
    BehaviorSubject
} from 'rxjs';


@Injectable()
export class CoronaStoreService {

    public latestPointsByLocation$ = new BehaviorSubject({});

    public setLastestPointsData(latestPointsByLocation: Record<string, any>) {
        this.latestPointsByLocation$.next({
            ...this.latestPointsByLocation$.value,
            ...latestPointsByLocation,
        });
    }

}
