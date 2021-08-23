// source - https://coronadatascraper.com/#timeseries-byLocation.json
// https://auravision.ai/covid19-lockdown-tracker/

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const countryNamesByCode = require('../data/country-names-by-code.json');
const stateNamesByCode = require('../data/state-names-by-code');
const timeSeriesByLocation = require('../data/timeseries-byLocation.json');
const csv = require('csv-parser')
const _ = require('lodash');

const JhData = require('./jh-data');

const ASSET_PATH = 'src/assets';
const DATA_PATH = 'scripts/data';
const targetPath = 'src/assets/jh-corona';


module.exports = class LockdownData {

    constructor() {
        this.countryReplacements = {
            'United States': 'US',
            'Czechia': 'Czech Republic'
        };
    }

    async writeLockdownData(fileNames) {
        const lockdownData = await this.getLockdownData();

        const lockdownDataByFileName = {};
        lockdownData.forEach((lockdownEntry) => {
            const lockdownCountry = this.countryReplacements[lockdownEntry.country] || lockdownEntry.country;
            const locationArr = [lockdownCountry, lockdownEntry.place].filter(Boolean);

            const fileName = this.getFileNameFromLocationArr(locationArr);
            const fileNameSplit = fileName.split('_');
            fileNameSplit.push('_container');
            _.set(lockdownDataByFileName, fileNameSplit, lockdownEntry);
        });

        const usedLockdownData = new Set();
        const flatLockdownDataByFileName = {};
        fileNames.forEach((fileName) => {
            const fileNameSplit = fileName.split('_');

            const placesToCheck = [
                [...fileNameSplit, '_container'],
                [...fileNameSplit.slice(0, 2), '_container'],
                [...fileNameSplit.slice(0, 1), '_container'],
            ];
            const nearestAncestorLockdownData = _.get(lockdownDataByFileName, placesToCheck[0])
                || _.get(lockdownDataByFileName, placesToCheck[1])
                || _.get(lockdownDataByFileName, placesToCheck[2]);

            usedLockdownData.add(nearestAncestorLockdownData);
            if (nearestAncestorLockdownData) {
                flatLockdownDataByFileName[fileName] = nearestAncestorLockdownData;
            }
        });

        lockdownData.forEach((lockdownEntry) => {
            if (!usedLockdownData.has(lockdownEntry)) {
                console.log('unusedLockdownEntry', [lockdownEntry.country, lockdownEntry.place])
            }
        })

        const filePath = `${targetPath}/lockdown-data-by-file-name.json`;
        fs.writeFileSync(filePath, JSON.stringify(flatLockdownDataByFileName, null, 2));
        console.log(`${Object.keys(flatLockdownDataByFileName).length} locations assigned lockdown data`);

    }

    async getLockdownData() {
        const lockdownKeysByKeys = {
            country: 'Country',
            endDate: 'End date',
            level: 'Level',
            place: 'Place',
            startDate: 'Start date',
        };

        const results = [];
        return new Promise((res, rej) => {
            fs.createReadStream(`${DATA_PATH}/lockdown_dates.csv`)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    const cleanLockdown = results.map((d) => {
                        return _.mapValues(lockdownKeysByKeys, (key) => d[key]);
                    });
                    res(cleanLockdown);
                });
        });
    }

    // logic used in jh-data
    getFileNameFromLocationArr(locationArr) {
        const safeKeys = locationArr.map((location) => {
            return location.replace(/ /g, '-')
                .replace(/'/g, '')
                .replace(/\*/g, '')
                .replace(/\./g, '');
        });
        return safeKeys.join('_');
    }

}
