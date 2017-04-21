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

import { FileService } from './services/file.service';
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