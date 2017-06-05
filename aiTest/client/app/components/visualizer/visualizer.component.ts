import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, Inject} from '@angular/core';
const _ = require('lodash');
const $ = require('jquery');

@Component({
	selector: 'visualizer',
	template: require('./visualizer.tpl.html'),
	styles: [require('./visualizer.scss')],
})
export class VisualizerComponent {

	@Input('projects') projects;
	@Input('restart') restart;
	@ViewChild('visualizerContainer') visualizerContainer;

	constructor(
		@Inject('project') private projectService,
	){
	}

	ngOnInit(){

	    const THREE = require('three-js')();
	    require('./lib/CSS3DRenderer.js')(THREE);
	    require('./lib/TrackBallControls.js')(THREE);
	    const element = $(this.visualizerContainer.nativeElement);

	    const Renderer = require('./Renderer.js');
	    const Board = require('./models/Board.js');
	    const bot1 = require('./bot1.js');
	    const bot2 = require('./bot2.js');

	    const renderer = new Renderer({
	        width: element.innerWidth(),
	        height: element.innerHeight(),
	        context: element[0],
	    })
	    const board1 = new Board({
	        pos: {
	            x: -3500,
	        }
	    })
	    const board2 = new Board({
	        pos: {
	            x: 3500,
	        }
	    })

	    renderer.setBoard(board1)
	    renderer.setBoard(board2)
	    renderer.startRendering();

	    bot1(board1)
	    bot2(board2)

	    board1.restartGame()
	    board2.restartGame()

	    renderer.dramaticEntry()
	        .then(function(){
	            renderer.attachControls()
	        })
		}

}
