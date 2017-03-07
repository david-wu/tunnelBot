require('babel-core/register');
require('babel-polyfill');

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
// import {MaterialModule} from '@angular/material';
import 'hammerjs';

import {AppComponent} from './app.component';
import {TerminalComponent} from './components/terminal/terminal.component';
import {NoteService} from './services/note.service';
import {SocketService} from './services/socket.service'

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		// MaterialModule
	],
	declarations: [
		AppComponent,
		TerminalComponent
	],
	providers: [
		{
			provide: 'note',
			useClass: NoteService
		},
		{
			provide: 'socket',
			useClass: SocketService
		},
		{
			provide: 'api',
			useValue: 'http://localhost'
		},
	],
	bootstrap: [AppComponent]
})
export class AppModule{};