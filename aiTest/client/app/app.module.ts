require('babel-core/register');
require('babel-polyfill');

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

// import {MaterialModule} from '@angular/material';
// import 'hammerjs';

import { AppComponent } from './app.component';
import { TerminalComponent } from './components/terminal/terminal.component';

import { FileViewerComponent } from './components/fileViewer/fileViewer.component';
import { FileListViewerComponent } from './components/fileListViewer/fileListViewer.component';
import { AceEditorComponent } from './components/aceEditor/aceEditor.component';

import { ProjectViewerComponent } from './components/projectViewer/projectViewer.component';
import { ProjectListViewerComponent } from './components/projectListViewer/projectListViewer.component';
import { ConsoleComponent } from './components/console/console.component';

import { SystemListViewerComponent } from './components/systemListViewer/systemListViewer.component';
import { SystemViewerComponent } from './components/systemViewer/systemViewer.component';

import { VisualizerComponent } from './components/visualizer/visualizer.component';

import { FileService } from './services/file.service';
import { ProjectService } from './services/project.service';
import { SocketService } from './services/socket.service'
import { SystemService } from './services/system.service'

import {MomentModule} from 'angular2-moment';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		MomentModule,
		// MaterialModule
	],
	declarations: [
		AppComponent,
		TerminalComponent,
		FileViewerComponent,
		FileListViewerComponent,
		AceEditorComponent,
		ProjectViewerComponent,
		ProjectListViewerComponent,
		ConsoleComponent,
		SystemListViewerComponent,
		SystemViewerComponent,
		VisualizerComponent
	],
	providers: [
		{
			provide: 'api',
			useValue: '/api',
		},
		{
			provide: 'fileService',
			useClass: FileService,
		},
		{
			provide: 'project',
			useClass: ProjectService,
		},
		{
			provide: 'socket',
			useClass: SocketService,
		},
		{
			provide: 'system',
			useClass: SystemService,
		},
	],
	bootstrap: [AppComponent]
})

export class AppModule{};
