import { CommonModule as NgCommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { CoronaFileViewerComponent } from '@src/app/corona/corona-file-viewer/corona-file-viewer.component';
import { CoronaComponent } from '@src/app/corona/corona.component';
import { CoronaRoutingModule } from '@src/app/corona/corona.routes';

import { SearchInputModule } from '@common/search-input/search-input.module';
import { FileExplorerModule } from '@file-explorer/file-explorer.module';
import { CommonModule as MyCommonModule } from '@src/app/common/common.module';
import { CoronaCompareDashboardComponent } from '@src/app/corona/corona-compare-dashboard/corona-compare-dashboard.component';
import { CoronaDashboardComponent } from '@src/app/corona/corona-dashboard/corona-dashboard.component';
import { LatestPointsViewerComponent } from '@src/app/corona/latest-points-viewer/latest-points-viewer.component';
import { SERVICES } from '@src/app/corona/services/index';

@NgModule({
    imports: [
        NgCommonModule,
        SearchInputModule,
        FormsModule,
        MatTableModule,
        MatSortModule,
        HttpClientModule,
        CoronaRoutingModule,
        MyCommonModule,
        FileExplorerModule,
    ],
    declarations: [
        CoronaComponent,
        CoronaFileViewerComponent,
        CoronaCompareDashboardComponent,
        CoronaDashboardComponent,
        LatestPointsViewerComponent,
    ],
    providers: [
        ...SERVICES,
    ],
})
export class CoronaModule { }
