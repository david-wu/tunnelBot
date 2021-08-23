
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const csv = require('csv-parser')

// jhPath is the location of https://github.com/CSSEGISandData/COVID-19
// targetPath is where you want the indexes
const jhPath = '../COVID-19';
const populationDataPath = 'scripts/data/population-figures-by-country-csv_csv.csv'
const targetPath = 'src/assets/jh-corona';

// file location details
const jhDataPath = path.join(jhPath, 'csse_covid_19_data/csse_covid_19_time_series');
const filePathsBySource = {
    totalGlobal: path.join(jhDataPath, 'time_series_covid19_confirmed_global.csv'),
    totalUs: path.join(jhDataPath, 'time_series_covid19_confirmed_US.csv'),
    deathsGlobal: path.join(jhDataPath, 'time_series_covid19_deaths_global.csv'),
    deathsUs: path.join(jhDataPath, 'time_series_covid19_deaths_US.csv'),
    recoveredGlobal: path.join(jhDataPath, 'time_series_covid19_recovered_global.csv'),
};
// useful columns in COVID-19 csvs
const fileSources = {
    totalGlobal: {
        cellKey: 'cases',
        countryKey: 'Country/Region',
        stateKey: 'Province/State',
        countyKey: '',
        nonDateKeys: [
            'Province/State',
            'Country/Region',
            'Lat',
            'Long',
        ],
    },
    totalUs: {
        cellKey: 'cases',
        countryKey: 'Country_Region',
        stateKey: 'Province_State',
        countyKey: 'Admin2',
        nonDateKeys: [
            'UID',
            'iso2',
            'iso3',
            'code3',
            'FIPS',
            'Admin2',
            'Province_State',
            'Country_Region',
            'Lat',
            'Long_',
            'Combined_Key',
        ],
    },
    deathsGlobal: {
        cellKey: 'deaths',
        countryKey: 'Country/Region',
        stateKey: 'Province/State',
        countyKey: '',
        nonDateKeys: [
            'Province/State',
            'Country/Region',
            'Lat',
            'Long',
        ],
    },
    deathsUs: {
        cellKey: 'deaths',
        countryKey: 'Country_Region',
        stateKey: 'Province_State',
        countyKey: 'Admin2',
        nonDateKeys: [
            'UID',
            'iso2',
            'iso3',
            'code3',
            'FIPS',
            'Admin2',
            'Province_State',
            'Country_Region',
            'Lat',
            'Long_',
            'Combined_Key',
            'Population',
        ],
    },
    recoveredGlobal: {
        cellKey: 'recovered',
        countryKey: 'Country/Region',
        stateKey: 'Province/State',
        countyKey: '',
        nonDateKeys: [
            'Province/State',
            'Country/Region',
            'Lat',
            'Long',
        ],
    },
};

module.exports = class JhData {

    constructor() {
        this.fileNames = new Set(['World']);
        this.timestampByDateStrCache = {};
    }

    async writeDataByLocation() {
        execSync(`rm -rf ${targetPath}`);
        const dataByFileSource = await this.getDataByFileSource();
        const dataByLocation = this.getDataByLocation(dataByFileSource);
        const worldData = this.populateStateAndCountryTotals(dataByLocation);
        dataByLocation.countryIndex['World'] = worldData;
        this.formatDataByLocation(dataByLocation);
        const flattenedTimeSeriesData = this.getFlattenedTimeSeriesData(dataByLocation);
        const lastPointDataByFileName = this.getLastPointDataByFileName(dataByLocation);

        this.writePopulationData(flattenedTimeSeriesData);
        this.writeLastPointData(lastPointDataByFileName);
        this.writeFlatLocationFiles(flattenedTimeSeriesData);
        this.writeFileNames(this.fileNames);
    }

    /**
     * writePopulationData
     * @param  {[type]} flattenedTimeSeriesData used for logging
     * @return {[type]}
     */
    async writePopulationData(flattenedTimeSeriesData) {
        const usPopulationByFileName = await this.getUsPopulation()
        const worldPopulationData = await this.getWorldPopulation();
        const populationByFileName = {
            ...usPopulationByFileName,
            ...worldPopulationData,
        };

        _.keys(flattenedTimeSeriesData).forEach((fileName) => {
            if (!populationByFileName[fileName]) {
                // console.log('missing pop', fileName);
            }
        })

        const filePath = path.join(targetPath, `population-by-file-name.json`);
        execSync(`mkdir -p ${targetPath}`);
        fs.writeFileSync(filePath, JSON.stringify(populationByFileName, null, 2));
    }

    async getWorldPopulation() {
        // https://datahub.io/JohnSnowLabs/population-figures-by-country#readme
        const populationByFileName = {};
        const worldPopulationData = await this.getFileData(populationDataPath);
        worldPopulationData.forEach((populationData) => {
            const fileName = this.getFileNameFromLocationArr([populationData.Country]);
            populationByFileName[fileName] = populationData.Year_2016;
        });
        return populationByFileName;
    }

    async getUsPopulation() {
        const deathData = await this.getFileData(filePathsBySource.deathsUs);
        const populationByFileName = {}
        deathData.forEach((row) => {
            const countyLocationArr = [
                row.Country_Region,
                row.Province_State,
                row.Admin2,
            ].filter(Boolean);
            const stateLocationArr = [
                row.Country_Region,
                row.Province_State,
            ];
            const countryLocationArr = [
                row.Country_Region,
            ];

            const population = Number(row.Population);
            const countyFileName = this.getFileNameFromLocationArr(countyLocationArr);
            populationByFileName[countyFileName] = population;

            const stateFileName = this.getFileNameFromLocationArr(stateLocationArr);
            populationByFileName[stateFileName] = populationByFileName[stateFileName]
                ? populationByFileName[stateFileName] + population
                : population;

            const countryFileName = this.getFileNameFromLocationArr(countryLocationArr);
            populationByFileName[countryFileName] = populationByFileName[countryFileName]
                ? populationByFileName[countryFileName] + population
                : population;

        });
        return populationByFileName;
    }

    formatDataByLocation(dataByLocation) {
        this.iterateOnDataByLocation(dataByLocation, (data, locationArr) => {
            const dateStrs = _.keys(data);
            const sortedDateStrs = _.sortBy(
                dateStrs,
                (dateKey) => this.getTimestampCached(dateKey),
            );
            const sortedFormattedData = [];
            let previousPoint = {
                cases: 0,
                deaths: 0,
                recovered: 0,
            };
            for(let i = 0; i < sortedDateStrs.length; i++) {
                const dateStr = sortedDateStrs[i];
                const unformattedCell = data[dateStr];
                const nextPoint = {
                    dateStr: dateStr,
                    cases: Math.max(previousPoint.cases, (unformattedCell.cases || 0)),
                    deaths: Math.max(previousPoint.deaths, (unformattedCell.deaths || 0)),
                    recovered: Math.max(previousPoint.recovered, (unformattedCell.recovered || 0)),
                };
                nextPoint.new = nextPoint.cases - previousPoint.cases,
                nextPoint.newDeaths = nextPoint.deaths - previousPoint.deaths,

                sortedFormattedData.push(nextPoint)
                previousPoint = nextPoint;
            }
            data.formatted = sortedFormattedData;
        });

    }

    getLastPointDataByFileName(dataByLocation) {
        const lastPointDataByFileName = {};
        this.iterateLevel(
            dataByLocation.countyIndex,
            (stateData, locationArr) => {
                const fileName = this.getFileNameFromLocationArr(locationArr);
                const stateLatestPointData = this.getLatestPointData(stateData);
                lastPointDataByFileName[fileName] = stateLatestPointData;
            },
            2,
        );
        this.iterateLevel(
            dataByLocation.stateIndex,
            (countryData, locationArr) => {
                const fileName = this.getFileNameFromLocationArr(locationArr);
                const countryLatestPointData = this.getLatestPointData(countryData);
                lastPointDataByFileName[fileName] = countryLatestPointData;
            },
            1,
        );
        this.iterateLevel(
            dataByLocation.countryIndex,
            (worldData, locationArr) => {
                const worldLatestPointData = this.getLatestPointData(worldData);
                lastPointDataByFileName['World'] = worldLatestPointData;
            },
            0,
        );
        return lastPointDataByFileName;
    }

    getLatestPointData(byDateDatasetsIndex) {
        const latestPointData = {};
        _.each(byDateDatasetsIndex, (dataset, childKey) => {
            latestPointData[childKey] = _.last(dataset.formatted);
        });
        return latestPointData;
    }

    getFileNameFromLocationArr(locationArr) {
        const safeKeys = locationArr.map((location) => {
            return location.replace(/ /g, '-')
                .replace(/'/g, '')
                .replace(/\*/g, '')
                .replace(/\./g, '');
        });
        const fileName = safeKeys.join('_');
        this.fileNames.add(fileName);
        return fileName;
    }

    populateStateAndCountryTotals(dataByLocation) {

        this.iterateLevel(
            dataByLocation.countyIndex,
            (stateData, locationArr) => {
                const countyData = _.values(stateData);
                const stateTotalData = this.joinByDateData(countyData);
                _.set(dataByLocation.stateIndex, locationArr, stateTotalData);

                // prefer existing state data
                if (!_.get(dataByLocation.stateIndex, locationArr)) {
                    _.set(dataByLocation.stateIndex, locationArr, stateTotalData);
                }
            },
            2,
        );

        this.iterateLevel(
            dataByLocation.stateIndex,
            (countryData, locationArr) => {
                const stateData = _.values(countryData);
                const countryTotalData = this.joinByDateData(stateData);

                // prefer existing country data if it's clean
                const existingCountryData = _.get(dataByLocation.countryIndex, locationArr);
                if (!existingCountryData || !this.isDataIsClean(existingCountryData)) {
                    _.set(dataByLocation.countryIndex, locationArr, countryTotalData);
                }
            },
            1,
        );

        let worldData;
        this.iterateLevel(
            dataByLocation.countryIndex,
            (worldDataData, locationArr) => {
                const countryData = _.values(worldDataData);
                worldData = this.joinByDateData(countryData);
            },
            0,
        );
        return worldData;
    }

    isDataIsClean(data) {
        const dates = Object.keys(data);
        if (!dates.length) {
            return false;
        }
        return _.every(data, (cell) => {
            if (!cell) {
                return false;
            }
            return typeof cell.cases === 'number'
                && typeof cell.deaths === 'number';
        });
        // if dates.forEach(() => {

        // })
    }

    /**
     * joinByDateData
     * @param  {[type]} byDateDatasets
     *   [
     *       { "1/1/20": {..}, "1/2/20": {..} },
     *       { "1/1/20": {..}, "1/2/20": {..} },
     *   ]
     * @returns { "1/1/20": {..}, "1/2/20": {..} }
     */
    joinByDateData(byDateDatasets) {
        const joinedByDateData = {};
        byDateDatasets.forEach((byDateData) => {
            _.each(byDateData, (byDateData, dateStr) => {
                joinedByDateData[dateStr] = joinedByDateData[dateStr] || [];
                joinedByDateData[dateStr].push(byDateData);
            });
        })
        return _.mapValues(joinedByDateData, (byDateDatas) => {
            let totalDeaths = 0;
            let totalRecovered = 0;
            let totalCases = 0;
            byDateDatas.forEach((byDateData) => {
                totalDeaths += (Number(byDateData.deaths) || 0);
                totalCases += (Number(byDateData.cases) || 0);
                totalRecovered += (Number(byDateData.recovered) || 0);
            });
            return {
                cases: totalCases,
                deaths: totalDeaths,
                recovered: totalRecovered,
            };
        });
    }

    getLatestDateStr(dateStrs) {
        return _.maxBy(dateStrs, (dateStr) => {
            return this.getTimestampCached(dateStr);
        });
    }

    getTimestampCached(dateStr) {
        if (this.timestampByDateStrCache[dateStr]) {
            return this.timestampByDateStrCache[dateStr];
        } else {
            const timestamp = +new Date(dateStr);
            this.timestampByDateStrCache[dateStr] = timestamp;
            return timestamp;
        }
    }

    writeFileNames(fileNames) {
        const fileNameArr = Array.from(fileNames);
        const filePath = path.join(targetPath, `file-names.json`);
        execSync(`mkdir -p ${targetPath}`);
        fs.writeFileSync(filePath, JSON.stringify(fileNameArr, null, 2));
    }


    getFlattenedTimeSeriesData(dataByLocation) {
        const flatData = {};
        this.iterateOnDataByLocation(
            dataByLocation,
            (data, locationArr) => {
                const fileName = this.getFileNameFromLocationArr(locationArr);
                flatData[fileName] = data;
            },
        );
        return flatData;
    }

    writeFlatLocationFiles(flatData) {
        const dirPath = path.join(targetPath, 'time-series', );
        execSync(`mkdir -p ${dirPath}`);
        _.each(flatData, (data, fileName) => {
            const filePath = path.join(dirPath, `${fileName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data.formatted, null, 2));
        });
    }

    writeLastPointData(lastPointData) {
        const dirPath = path.join(targetPath, 'latest-points', );
        execSync(`mkdir -p ${dirPath}`);
        _.each(lastPointData, (lastPointIndex, indexFileName) => {
            const filePath = path.join(dirPath, `${indexFileName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(lastPointIndex, null, 2));
        });
    }

    writePopulationByFileName(populationByFileName) {
        const dirPath = path.join(targetPath, 'population', );
        const filePath = path.join(dirPath, `by-file-name.json`);
        execSync(`mkdir -p ${dirPath}`);
        fs.writeFileSync(filePath, JSON.stringify(populationByFileName, null, 2));
    }

    getDataByLocation(dataByFileSource) {
        const countryIndex = {};
        const stateIndex = {};
        const countyIndex = {};

        _.each(fileSources, (fileSource, fileSourceName) => {
            const fileData = dataByFileSource[fileSourceName];
            _.each(fileData, (fileColumn) => {
                const country = fileColumn[fileSource.countryKey];
                const state = fileColumn[fileSource.stateKey];
                const county = fileColumn[fileSource.countyKey];
                fileSource.nonDateKeys.forEach((nonDateKey) => {
                    delete fileColumn[nonDateKey];
                });
                if (county) {
                    _.each(fileColumn, (cellValue, dateStr) => {
                        _.set(countyIndex, [country, state, county, dateStr, fileSource.cellKey], Number(cellValue));
                    });
                } else if (state) {
                    _.each(fileColumn, (cellValue, dateStr) => {
                        _.set(stateIndex, [country, state, dateStr, fileSource.cellKey], Number(cellValue));
                    });
                } else if (country) {
                    _.each(fileColumn, (cellValue, dateStr) => {
                        _.set(countryIndex, [country, dateStr, fileSource.cellKey], Number(cellValue));
                    });
                }
            });
        });
        return {
            countryIndex,
            stateIndex,
            countyIndex,
        };
    }

    async getDataByFileSource() {
        const dataByFileSource = {};
        const metrics = Object.keys(filePathsBySource);
        for(let i = 0; i < metrics.length; i++) {
            const metric = metrics[i];
            dataByFileSource[metric] = await this.getFileData(filePathsBySource[metric])
        }
        return dataByFileSource;
    }

    async getFileData(filePath) {
        const results = [];
        return new Promise((res, rej) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => res(results));
        });
    }

    iterateOnDataByLocation(dataByLocation, iteratee) {
        this.iterateLevel(
            dataByLocation.countyIndex,
            (data, locationArr) => iteratee(data, locationArr),
            3,
        );
        this.iterateLevel(
            dataByLocation.stateIndex,
            (data, locationArr) => iteratee(data, locationArr),
            2,
        );
        this.iterateLevel(
            dataByLocation.countryIndex,
            (data, locationArr) => iteratee(data, locationArr),
            1,
        );
    }

    iterateLevel(index, iteratee, targetDepth, depth = 0, keys = []) {
        if (depth === targetDepth) {
            iteratee(index, keys);
            return;
        }
        _.each(index, (child, key) => {
            this.iterateLevel(child, iteratee, targetDepth, depth + 1, [...keys, key]);
        });
    }

}
