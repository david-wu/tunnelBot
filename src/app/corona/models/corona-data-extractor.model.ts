import {
  last,
  mapValues,
} from 'lodash';

import { CoronaKeys } from '@src/app/corona/models/corona-keys.enum';
import { NormalKeys } from '@src/app/corona/models/normal-keys.enum';
import { getDateFromStr } from '@src/app/utils/index';

export class CoronaDataExtractor {

  public cleanJh(fileData, population: number = 1, distanceFromPointToAvg: number = 0) {
    const cleanData = [];

    fileData.forEach((point) => {
      const cleanPoint = {
        dateStr: point.dateStr,
        date: getDateFromStr(point.dateStr),
        timestamp: +getDateFromStr(point.dateStr),
        [CoronaKeys.CASES]: (point.cases || 0),
        [CoronaKeys.DEATHS]: (point.deaths || 0),
        [CoronaKeys.NEW_DEATHS]: (point.newDeaths || 0),
        [CoronaKeys.RECOVERED]: (point.recovered || 0),
        [CoronaKeys.NEW]: (point.new || 0),
      } as any;
      cleanPoint[CoronaKeys.ACTIVE] = cleanPoint.cases - cleanPoint.new - cleanPoint.recovered;
      cleanData.push(cleanPoint);
    });

    // if there is a hole in the data, this removes everything before that hole
    let spottyDataClipIndex = 0;
    const overOneDay = (1000 * 60 * 60 * 24) * 1.2;
    for (let i = 1; i < cleanData.length; i++) {
      const point = cleanData[i];
      const previousPoint = cleanData[i - 1];
      if (!previousPoint) {
        break;
      }
      if ((previousPoint.timestamp + overOneDay) < point.timestamp) {
        spottyDataClipIndex = i;
      }
    }
    const unspottyData = cleanData.slice(spottyDataClipIndex);

    // if there's a bunch leading 0's in the data, this removes them except the first 0
    const firstNonZeroIndex = unspottyData.findIndex((point) => point[CoronaKeys.CASES] !== 0);
    const clipIndex = Math.max(0, firstNonZeroIndex - 1);
    const oneLeadingZeroData = unspottyData.slice(clipIndex);

    let boringDataClipIndex = 0;
    const lastCases = last(oneLeadingZeroData).cases;
    for (let i = 1; i < oneLeadingZeroData.length; i++) {
      const point = oneLeadingZeroData[i];
      if ((point.cases < 100) && ((point.cases / lastCases) < 0.01)) {
        boringDataClipIndex = i;
      } else {
        break;
      }
    }
    let coolData = oneLeadingZeroData.slice(boringDataClipIndex);

    if (distanceFromPointToAvg) {
      coolData = this.getAvgSeries(
        coolData,
        [
          CoronaKeys.CASES,
          CoronaKeys.DEATHS,
          CoronaKeys.NEW_DEATHS,
          CoronaKeys.RECOVERED,
          CoronaKeys.NEW,
        ],
        distanceFromPointToAvg,
      );
    }
    return this.getNormalizedData(coolData, population);
  }

  public getNormalizedData(cleanData, population: number = 1) {
    const normalizedData = [];

    for (let i = 0; i < cleanData.length; i++) {
      const cleanPoint = cleanData[i];
      // const previousCases = cleanPoint.cases - cleanPoint.new;

      const previousPoint = cleanData[i - 1];

      let r = 0;
      if (previousPoint && previousPoint.new) {
        const changeInNewCases = cleanPoint.new - previousPoint.new;
        r = changeInNewCases / (previousPoint.new);
      }

      // const previousCases = cleanPoint.cases - cleanPoint.new;
      // const r = previousCases
      // ? (cleanPoint.new / previousCases)
      // : 1;
      const normalizedPoint = {
        ...cleanData[i],
        [NormalKeys.R]: r,
        [NormalKeys.CASES]: (cleanPoint.cases / population) * 1000000,
        [NormalKeys.NEW]: (cleanPoint.new / population) * 1000000,
        [NormalKeys.ACTIVE]: (cleanPoint.active / population) * 1000000,
        [NormalKeys.RECOVERED]: (cleanPoint.recovered / population) * 1000000,
        [NormalKeys.DEATHS]: (cleanPoint.deaths / population) * 1000000,
        [NormalKeys.NEW_DEATHS]: (cleanPoint.newDeaths / population) * 1000000,
      };
      normalizedData.push(normalizedPoint);
    }

    for (let i = 0; i < cleanData.length; i++) {
      const ppPreviousPoint = cleanData[i - 3] || { cases: 0, new: 0 };
      const pPreviousPoint = cleanData[i - 2] || { cases: 0, new: 0 };
      const previousPoint = cleanData[i - 1] || { cases: 0, new: 0 };
      const point = cleanData[i];
      const nextPoint = cleanData[i + 1] || { cases: 0, new: 0 };
      const nNextPoint = cleanData[i + 2] || { cases: 0, new: 0 };

      const totalCases = [ppPreviousPoint, pPreviousPoint, previousPoint, point, nextPoint]
        .reduce((sum, point) => sum + point.cases, 0);
      const totalNew = [pPreviousPoint, previousPoint, point, nextPoint, nNextPoint]
        .reduce((sum, point) => sum + point.new, 0);

      const newR = totalCases ? (totalNew / totalCases) : 1;
      const clippedR = Math.min(newR, 1);
      normalizedData[i][NormalKeys.R_AVG] = clippedR;
    }
    return normalizedData;
  }

  public getAvgSeries(
    cleanData: any[],
    keys: string[],
    distanceFromPointToAvg: number = 3,
  ) {
    const avgSeries = [];

    for (let i = 0; i < cleanData.length; i++) {

      // points towards the ends of the series could be averaged over a smaller number of points
      let startIndex = i - distanceFromPointToAvg;
      let endIndex = i + distanceFromPointToAvg + 1;
      while (startIndex < 0) {
        startIndex++;
        endIndex--;
      }
      while (endIndex > cleanData.length) {
        startIndex++;
        endIndex--;
      }

      const pointsToAvg = cleanData.slice(startIndex, endIndex);
      const sums = {};
      pointsToAvg.forEach((point) => {
        keys.forEach((key: string) => {
          sums[key] = sums[key]
            ? sums[key] + point[key]
            : point[key];
        });
      });
      const avgPoint = mapValues(sums, (value: number) => value / pointsToAvg.length);
      const newPoint = {
        ...cleanData[i],
        ...avgPoint,
      };
      avgSeries.push(newPoint);
    }
    return avgSeries;
  }

}

