
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  forkJoin,
  Observable,
} from 'rxjs';

@Injectable()
export class CoronaService {

  public latestPointsPath = '/assets/jh-corona/latest-points';

  constructor(public http: HttpClient) {}

  public getCoronaFileUrl(location: string): string {
    return `/assets/jh-corona/time-series/${location}.json`;
  }

  public getCoronaFileByLocation(location: string): Observable<any> {
    return this.http.get(this.getCoronaFileUrl(location));
  }

  public getCoronaLatestPoints(location: string): Observable<any> {
    return this.http.get(`${this.latestPointsPath}/${location}.json`);
  }

  public getCoronaLatestPointsMultiple(locations: string[]): Observable<any[]> {
    const requests$ = locations.map((location: string) => {
      return this.getCoronaLatestPoints(location);
    });
    return forkJoin(requests$);
  }

}
