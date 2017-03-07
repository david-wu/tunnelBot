import {Component} from '@angular/core';


@Component({
  selector: 'app',
  template: require('./app.tpl.html'),
})
export class AppComponent{
	cpType = 'ruby';
	constructor(){}
}
