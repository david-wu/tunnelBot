
import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    public setFavoriteLocations(locations: string[] = []) {
        const locationsStr = JSON.stringify(locations);
        localStorage.setItem('favorites-jh', locationsStr);
    }

    public getFavoriteLocations(): string[] {
        const locationsStr = localStorage.getItem('favorites-jh') || '[]';
        const locations = JSON.parse(locationsStr);

        return locations.length ? locations : [
            'US',
            'US_California',
            'US_California_Santa-Clara',
        ];
    }

}
