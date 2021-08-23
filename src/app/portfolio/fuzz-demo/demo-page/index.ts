
import { DemoPageComponent } from '@src/app/portfolio/fuzz-demo/demo-page/demo-page.component';
import { FuzzItemListViewerComponent } from '@src/app/portfolio/fuzz-demo/demo-page/fuzz-item-list-viewer/fuzz-item-list-viewer.component';
import { FuzzalyticsComponent } from '@src/app/portfolio/fuzz-demo/demo-page/fuzzalytics/fuzzalytics.component';
import { OptionsAndCodeComponent } from '@src/app/portfolio/fuzz-demo/demo-page/options-and-code/options-and-code.component';
import { TabbedWindowComponent } from '@src/app/portfolio/fuzz-demo/demo-page/tabbed-window/tabbed-window.component';

export const DEMO_PAGE_COMPONENTS = [
	DemoPageComponent,
	TabbedWindowComponent,
	FuzzItemListViewerComponent,
	FuzzalyticsComponent,
	OptionsAndCodeComponent,
];

export * from './demo-page.component';
export * from './tabbed-window/tabbed-window.component';
export * from './fuzz-item-list-viewer/fuzz-item-list-viewer.component';
export * from './fuzzalytics/fuzzalytics.component';
export * from './options-and-code/options-and-code.component';
