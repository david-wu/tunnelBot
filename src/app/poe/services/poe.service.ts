
import {
  HttpClient,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PoeService {

  // public poeEndpoint = `http://www.pathofexile.com/api/public-stash-tabs?accountName=dawu`;
  // public poeEndpoint = 'http://www.pathofexile.com/api/public-stash-tabs';

  constructor(public http: HttpClient) {}

  public getPublicStashes(accountName: string): Observable<any> {
// let HttpHeaders  = new Headers();
// headers.append('authority', 'www.pathofexile.com');
    return this.http.get('/api/poe');
    //   params: {
    //     accountName: accountName,
    //   },
    //   // headers: new HttpHeaders({
    //   //   authority: 'www.pathofexile.com',
    //   // }),
    // });
    // return this.http.jsonp(this.poeEndpoint, 'callback');
    // return this.http.jsonp(this.poeEndpoint, 'callback');
  }

}
