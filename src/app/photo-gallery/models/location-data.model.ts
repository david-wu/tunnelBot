import Geohash from 'latlon-geohash';
import { padStart } from 'lodash';
import { S2 } from 's2-geometry';

export class LocationData {

  public latitude: number;

  public longitude: number;

  public geohash: string;

  public s2Id: string;

  public locationSource: string;

  public static fromLatLong(
    latitude: number,
    longitude: number,
    overrides: Partial<LocationData> = {},
  ): LocationData {
    const geohash = Geohash.encode(latitude, longitude, 12);
    const s2Key = S2.latLngToKey(latitude, longitude, 30);
    const s2Id = padStart(S2.keyToId(s2Key), 22, '0');

    return Object.assign(new LocationData(), {
      latitude,
      longitude,
      geohash,
      s2Id,
      ...overrides,
    });
  }

  public isEqual(location: LocationData): boolean {
    return location &&
      this.latitude === location.latitude &&
      this.longitude === location.longitude;
  }

}
