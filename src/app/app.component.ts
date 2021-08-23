import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public readonly pathsWithNoNav = ['photos', 'image-sources', 'pp', 'pp/pp-test-app'];
  public navVisible$: Observable<boolean>;

  constructor(
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.navVisible$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => {
        const splitUrl = this.router.url.split('/').slice(1);
        for(let i = 0; i < this.pathsWithNoNav.length; i++) {
          const pathWithNoNav = this.pathsWithNoNav[i].split('/');
          const routerPath = this.router.url.split('/').slice(1);
          if (this.urlContainedBy(pathWithNoNav, routerPath)) {
            return false;
          }
        }
        return true;
      }),
    );
  }

  public getRouteUrl(route, segmentCount) {
    const segments = [];
    while(segmentCount >= 0 && route.firstChild) {
      route = route.firstChild;
      if (route.url.value[0]) {
        segments.push(route.url.value[0].path);
      }
      segmentCount--;
    }
    return segments.join('/');
  }

  public urlContainedBy(short, containerUrl) {
    for(let j = 0; j < short.length; j++) {
      if (short[j] !== containerUrl[j]) {
        return false;
      }
    }
    return true;
  }

}
