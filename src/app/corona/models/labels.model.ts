import { CoronaKeys } from '@src/app/corona/models/corona-keys.enum';
import { NormalKeys } from '@src/app/corona/models/normal-keys.enum';

export class Labels {

    public static readonly corona = {
        [CoronaKeys.DATE_STR]: 'Date',
        [CoronaKeys.DATE]: 'Date',
        [CoronaKeys.TIMESTAMP]: 'Date',
        [CoronaKeys.CASES]: 'Total',
        [CoronaKeys.NEW]: 'New',
        [CoronaKeys.ACTIVE]: 'Active',
        [CoronaKeys.RECOVERED]: 'Recovered',
        [CoronaKeys.DEATHS]: 'Deaths',
        [CoronaKeys.NEW_DEATHS]: 'New Deaths',
        [NormalKeys.CASES]: 'Total',
        [NormalKeys.R]: 'Growth rate (R)',
        [NormalKeys.R_AVG]: 'R Avg.',
        [NormalKeys.NEW]: 'New',
        [NormalKeys.ACTIVE]: 'Active',
        [NormalKeys.RECOVERED]: 'Recovered',
        [NormalKeys.DEATHS]: 'Deaths',
        [NormalKeys.NEW_DEATHS]: 'New Deaths',
    };

}
