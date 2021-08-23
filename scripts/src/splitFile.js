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
const LockdownData = require('./lockdown-data');

const ASSET_PATH = 'src/assets';
const DATA_PATH = 'scripts/data';

populateAssets();

async function populateAssets() {
    const jh = new JhData();
    await jh.writeDataByLocation();

    const ld = new LockdownData();
    ld.writeLockdownData(jh.fileNames);

    // execSync(`rm -rf ${ASSET_PATH}/corona`);
    // execSync(`mkdir -p ${ASSET_PATH}/corona/by-location`);
    // recordStaticFiles();

    // const fileNames = getFileNames(timeSeriesByLocation);
    // recordTimeSeriesByLocation(timeSeriesByLocation);
    // recordFileNames(fileNames);

    // const lockdownData = await getLockdownData()
    // const countryCodeByNames = getCountryCodeByNames()
    // const stateCodesByNames = getStateCodesByNames()
    // const locationSet = new Set(Object.keys(timeSeriesByLocation));
    // const lockdownDataByLocation = getLockdownDataByLocation(
    //     lockdownData,
    //     countryCodeByNames,
    //     stateCodesByNames,
    //     locationSet,
    // );
    // const expandedLockdownDataByLocation = expandLockdownDataByLocation(
    //     lockdownDataByLocation,
    //     locationSet,
    // );
    // const allLockdownData = {
    //     ...lockdownDataByLocation,
    //     ...expandedLockdownDataByLocation,
    // }
    // recordLockdownDataByLocation(allLockdownData);
    // console.log(`lockdown summary: ${Object.keys(lockdownDataByLocation).length}/${lockdownData.length} linked\n`)
    // console.log(`lockdown summary: ${Object.keys(allLockdownData).length} including children}`);
}

const locationLevels = {
    ['National']: 'National',
    ['State']: 'State',
    ['City']: 'City',
    ['Metropolitan Area']: 'Metropolitan Area',
    ['County']: 'County',
    ['Province']: 'Province',
    ['Region']: 'Region',
    ['Municipality']: 'Municipality',
    ['Administrative']: 'Administrative',
    ['Island group']: 'Island group',
    ['Area']: 'Area',
};

/**
 * expandLockdownDataByLocation
 * If California is in lockdown, all it's counties are too.
 * This applies lockdownDataByLocation to nested locations
 * @param lockdownDataByLocation
 * @return
 */
function expandLockdownDataByLocation(lockdownDataByLocation, locationSet) {
    // country, state, county
    const locations = Array.from(locationSet)
        .sort((location1, location2) => location1.length - location2.length);

    // locationsByParts will have all deep child Locations for each section
    const locationsByParts = {};
    locations.forEach((location) => {
        const locationParts = location.split(', ').reverse();
        for(let i = 0; i < locationParts.length; i++) {
            const parts = locationParts.slice(0, i + 1);
            const oldLocation = _.get(locationsByParts, parts) || { _children: [] };
            const nextLocation = {
                ...oldLocation,
                _children: [
                    ...oldLocation._children,
                    location,
                ],
            };
            _.set(locationsByParts, parts, nextLocation);
        }
    });

    const additionalLockdownDataByLocation = {}
    _.each(lockdownDataByLocation, (lockdownData, location) => {
        const locationParts = location.split(', ').reverse();
        const childNode = _.get(locationsByParts, locationParts) || { _children: [] };
        const children = childNode._children;
        children.forEach((childLocation) => {
            additionalLockdownDataByLocation[childLocation] = lockdownData;
        });
    });
    return additionalLockdownDataByLocation;
}

function getLockdownDataByLocation(
    lockdownData,
    countryCodeByNames,
    stateCodesByNames,
    locationSet,
) {
    const lockdownDataByLocation = {};

    lockdownData.forEach((lockdownInfo) => {
        const countryCode = countryCodeByNames[lockdownInfo.country];
        if (!countryCode) {
            console.log('lockdown: unknown countryCode', lockdownInfo)
        }

        if (!locationLevels[lockdownInfo.level]) {
            console.log('lockdown: unknown location level', lockdownInfo)
        }

        let levelLocation = lockdownInfo.place;
        if (countryCode === 'USA' && (lockdownInfo.level === locationLevels.State)) {
            levelLocation = stateCodesByNames[levelLocation];
            if (!levelLocation) {
                console.log('lockdown: unknown state', lockdownInfo);
            }
        }

        const location = levelLocation ? `${levelLocation}, ${countryCode}` : countryCode;
        if (locationSet.has(location)) {
            lockdownDataByLocation[location] = lockdownInfo;
        } else {
            // console.log('lockdown: unknown location', lockdownInfo);
        }
    });
    return lockdownDataByLocation;
}

function getStateCodesByNames() {
    const stateCodesByNames = {};
    _.each(stateNamesByCode, (v, k) => stateCodesByNames[v] = k);
    return stateCodesByNames;
}

function getCountryCodeByNames() {
    const countryCodeByNames = {};
    _.each(countryNamesByCode, (v, k) => countryCodeByNames[v] = k);
    return countryCodeByNames;
}

async function getLockdownData() {
    const results = [];
    const lockdownKeysByKeys = {
        country: 'Country',
        endDate: 'End date',
        level: 'Level',
        place: 'Place',
        startDate: 'Start date',
    };

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

function recordStaticFiles() {
    fs.writeFileSync(`${ASSET_PATH}/state-names-by-code.json`, JSON.stringify(stateNamesByCode));
    fs.writeFileSync(`${ASSET_PATH}/country-names-by-code.json`, JSON.stringify(countryNamesByCode));
}

function recordLockdownDataByLocation(lockdownDataByLocation) {
    fs.writeFileSync(`${ASSET_PATH}/corona/lockdown-data-by-location.json`, JSON.stringify(lockdownDataByLocation));
}

function getFileNames(seriesByLocation) {
    const locations = Object.keys(seriesByLocation);
    return locations.map((location) => location.replace(/\//g, '-'));
}

function recordFileNames(fileNames) {
    fs.writeFileSync(`${ASSET_PATH}/corona/locations.json`, JSON.stringify(fileNames));
}

function recordTimeSeriesByLocation(seriesByLocation) {
    const locations = Object.keys(seriesByLocation);
    for(let i = 0 ; i < locations.length; i++) {
        const location = locations[i];
        const timeSeriesStr = JSON.stringify(seriesByLocation[location]);
        const fileName = location.replace(/\//g, '-');
        const filePath = path.join(`${ASSET_PATH}/corona/by-location`, `${fileName}.json`);
        fs.writeFileSync(filePath, timeSeriesStr);
    }
}
