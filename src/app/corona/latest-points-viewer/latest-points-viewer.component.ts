import {
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import {
  fromPairs,
  zip,
} from 'lodash';
import {
  Observable,
} from 'rxjs';
import {
  map,
  startWith,
} from 'rxjs/operators';

import { File } from '@file-explorer/index';
import {
  CoronaService,
  CoronaStoreService,
} from '@src/app/corona/services/index';

@Component({
  selector: 'dwu-latest-points-viewer',
  templateUrl: './latest-points-viewer.component.html',
  styleUrls: ['./latest-points-viewer.component.scss']
})
export class LatestPointsViewerComponent {

  @Input() locations: string[];
  @ViewChild(MatSort, { static: true }) sort;

  public dataSource$: Observable<MatTableDataSource<any>>;
  public tableData$: Observable<any>;
  public displayedColumns = ['location', 'cases', 'new', 'deaths', 'newDeaths'];

  constructor(
    public coronaService: CoronaService,
    public coronaStoreService: CoronaStoreService,
  ) {}

  public ngOnChanges(changes) {
    if (changes.locations && this.locations) {
      const locations$ = this.coronaService.getCoronaLatestPointsMultiple(this.locations);
      const sub = locations$.pipe(
        map((files: File[]) => fromPairs(zip(this.locations, files))),
        startWith(undefined),
      ).subscribe((fileData: Record<string, any>) => {
        this.coronaStoreService.setLastestPointsData(fileData);
      });
    }
  }

  public ngOnInit() {
    this.tableData$ = this.coronaStoreService.latestPointsByLocation$.pipe(
      map((latestPointsByLocation: Record<string, any>) => {
        const latestPointData = latestPointsByLocation[this.locations[0]] || {};
        const locations = Object.keys(latestPointData);
        const locationData = locations.map((location: string) => {
          return {
            ...latestPointData[location],
            location,
          };
        });
        const dataSource = new MatTableDataSource(locationData);
        dataSource.sort = this.sort;
        return dataSource;
      }),
      );
  }
}
