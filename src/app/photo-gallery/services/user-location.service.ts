import { Injectable } from '@angular/core';

import { LocationData } from '@photo-gallery/models/index';

@Injectable()
export class UserLocationService {

  public getUserLocation(): Promise<LocationData> {
    // console.log('getUserLocation')
    // this.getIsPermissionGranted();

    return new Promise((resolve, reject) => {
      const geolocationOptions = {
        enableHighAccuracy: false,
        maximumAge: 0,
      };
      navigator.geolocation.getCurrentPosition(
        (userLocation: any) => {
          const latitude = userLocation.coords.latitude;
          const longitude = userLocation.coords.longitude;
          const locationData = LocationData.fromLatLong(
            latitude,
            longitude,
            { locationSource: 'USER' },
          );
          resolve(locationData);
        },
        (error) => reject(error),
        geolocationOptions,
      );
    });
  }

  public getIsPermissionGranted(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (navigator.permissions) {
        return navigator.permissions.query({ name: 'geolocation' })
          .then((permission: PermissionStatus) => {
            if (permission.state === 'granted') {
              resolve(true);
            } else {
              resolve(false);
            }
          });
      } else {
        reject(new Error('Permission API is not supported'));
      }
    });
    // return navigator.permissions.query({ name: 'geolocation' });
  }
}
