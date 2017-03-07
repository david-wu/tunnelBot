import 'core-js/shim';
import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

const globalAny:any = global;

globalAny.jQuery = globalAny.$ = require('jquery');
globalAny._ = require('lodash');

platformBrowserDynamic().bootstrapModule(AppModule);
