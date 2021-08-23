import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import * as d3 from 'd3';
import { round } from 'lodash';

import {
    CoronaDataExtractor,
    CoronaKeys,
    Labels,
    NormalKeys,
} from '@src/app/corona/models/index';
import {
    getDateFromLeadingYearStr,
} from '@src/app/utils/index';

@Component({
  selector: 'dwu-corona-dashboard',
  templateUrl: './corona-dashboard.component.html',
  styleUrls: ['./corona-dashboard.component.scss']
})
export class CoronaDashboardComponent {

    @Input() lockdownInfo: any;
    @Input() coronaFile: any;
    @Input() disabledBarKeys = new Set<string>();
    @Input() population = 0;
    @Output() disabledBarKeysChange = new EventEmitter<Set<string>>();
    @Input() disabledNormalKeys = new Set<string>();
    @Output() disabledNormalKeysChange = new EventEmitter<Set<string>>();

    @Input() isViewingNormalized = false;
    @Output() isViewingNormalizedChange = new EventEmitter<boolean>();
    @Input() isViewingLineChart = false;
    @Output() isViewingLineChartChange = new EventEmitter<boolean>();

    public hoverSeries;
    public coronaData: any[];
    public coronaExtractor = new CoronaDataExtractor();
    public hoverIndex = 0;
    public indicators;
    public distanceFromPointToAvg = 0;

    public readonly CoronaKeys = CoronaKeys;
    public readonly NormalKeys = NormalKeys;
    public readonly Labels = Labels;
    public readonly coronaKeys = [
        CoronaKeys.NEW,
        CoronaKeys.ACTIVE,
        CoronaKeys.RECOVERED,
        CoronaKeys.NEW_DEATHS,
        CoronaKeys.DEATHS,
    ];
    public readonly coronaViewKeys = [
        CoronaKeys.CASES,
        CoronaKeys.TIMESTAMP,
        CoronaKeys.NEW,
        CoronaKeys.ACTIVE,
        CoronaKeys.RECOVERED,
        CoronaKeys.NEW_DEATHS,
        CoronaKeys.DEATHS,
    ];
    public readonly perMilKeys = [
        NormalKeys.NEW,
        NormalKeys.ACTIVE,
        NormalKeys.RECOVERED,
        NormalKeys.NEW_DEATHS,
        NormalKeys.DEATHS,
    ];
    public readonly perMilViewKeys = [
        NormalKeys.CASES,
        CoronaKeys.TIMESTAMP,
        NormalKeys.NEW,
        NormalKeys.ACTIVE,
        NormalKeys.RECOVERED,
        NormalKeys.NEW_DEATHS,
        NormalKeys.DEATHS,
    ];
    public readonly coronaColorsByKey = {
        [CoronaKeys.NEW]: '#ED9797',
        [CoronaKeys.ACTIVE]: '#AD3E3E',
        [CoronaKeys.RECOVERED]: '#34A2AA',
        [CoronaKeys.DEATHS]: '#2B1919',
        [CoronaKeys.NEW_DEATHS]: '#65635F',
        [NormalKeys.NEW]: '#ED9797',
        [NormalKeys.ACTIVE]: '#AD3E3E',
        [NormalKeys.RECOVERED]: '#34A2AA',
        [NormalKeys.DEATHS]: '#2B1919',
        [NormalKeys.NEW_DEATHS]: '#65635F',
        [NormalKeys.CASES]: '#D6B902',
        [NormalKeys.R]: '#65635F',
        [NormalKeys.R_AVG]: '#1D62C4',
    };

    public readonly normalKeys = [
        NormalKeys.R,
        NormalKeys.R_AVG,
    ];
    public readonly normalizedViewKeys = [
        NormalKeys.R_AVG,
        NormalKeys.R,
        CoronaKeys.TIMESTAMP,
        CoronaKeys.CASES,
    ];
    public readonly formattersByKeys = {
        [NormalKeys.R_AVG]: this.toPercentage,
        [NormalKeys.R]: this.toPercentage,
        [CoronaKeys.TIMESTAMP]: d3.timeFormat('%-m/%e'),
    };

    public ngOnChanges(changes) {
        if (changes.coronaFile && this.coronaFile) {
            this.coronaData = this.coronaExtractor.cleanJh(
              this.coronaFile,
              this.population,
              this.distanceFromPointToAvg,
            );
            this.hoverIndex = this.coronaData.length - 1;
        }
        if (changes.lockdownInfo) {
            if (this.lockdownInfo) {
                const startDate = getDateFromLeadingYearStr(this.lockdownInfo.startDate);
                const endDate = getDateFromLeadingYearStr(this.lockdownInfo.endDate);
                const tenDaysLater = new Date(startDate);
                tenDaysLater.setDate(startDate.getDate() + 10);
                this.indicators = this.lockdownInfo && [
                    {
                        value: +startDate,
                        label: 'Start Lockdown',
                        color: '#164EB7',
                    },
                    {
                        value: +endDate,
                        label: 'End Lockdown',
                        color: '#729900',
                    },
                ];
            } else {
                this.indicators = undefined;
            }
        }
    }

    public onChangeAvgedDays(distanceFromPointToAvg: number) {
      this.distanceFromPointToAvg = distanceFromPointToAvg;
      this.coronaData = this.coronaExtractor.cleanJh(
        this.coronaFile,
        this.population,
        distanceFromPointToAvg,
      );
    }

    public onChangeNormalized(isViewingNormalized: boolean) {
        this.disabledBarKeysChange.emit(new Set());
        this.isViewingNormalized = isViewingNormalized;
        this.isViewingNormalizedChange.emit(isViewingNormalized);
    }

    public onChangeViewingLineChart(isViewingLineChart: boolean) {
        this.isViewingLineChart = isViewingLineChart;
        this.isViewingLineChartChange.emit(isViewingLineChart);
    }

    public toPercentage(d: number) {
        return `${round(d * 100, 2)}%`;
    }
}
