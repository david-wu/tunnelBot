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

import { FileEditorComponent } from './components/fileEditor/fileEditor.component';
import { FileViewerComponent } from './components/fileEditor/fileViewer/fileViewer.component';
import { FileListViewerComponent } from './components/fileEditor/fileListViewer/fileListViewer.component';
import { AceEditorComponent } from './components/fileEditor/aceEditor/aceEditor.component';


import { ProjectEditorComponent } from './components/projectEditor/projectEditor.component';
import { ProjectViewerComponent } from './components/projectEditor/projectViewer/projectViewer.component';
import { ProjectListViewerComponent } from './components/projectEditor/projectListViewer/projectListViewer.component';


import { FileService } from './services/file.service';
import { ProjectService } from './services/project.service';
import { NoteService } from './services/note.service';
import { SocketService } from './services/socket.service'


@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule
		// MaterialModule
	],
	declarations: [
		AppComponent,
		TerminalComponent,
		FileEditorComponent,
		FileViewerComponent,
		FileListViewerComponent,
		AceEditorComponent,
		ProjectEditorComponent,
		ProjectViewerComponent,
		ProjectListViewerComponent,
	],
	providers: [
		{
			provide: 'api',
			useValue: '/api',
		},
		{
			provide: 'file',
			useClass: FileService,
		},
		{
			provide: 'project',
			useClass: ProjectService,
		},
		{
			provide: 'note',
			useClass: NoteService,
		},
		{
			provide: 'socket',
			useClass: SocketService,
		},
	],
	bootstrap: [AppComponent]
})
export class AppModule{};