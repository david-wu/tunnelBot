global._ = require('lodash');

const THREE = require('three-js')();
require('./lib/CSS3DRenderer.js')(THREE);
require('./lib/TrackBallControls.js')(THREE);





const Board = require('./components/Board.js');

const board = new Board();




const Renderer = require('./components/Renderer.js');
const renderer = new Renderer({
	width: window.innerWidth,
	height: window.innerHeight,
	context: document.getElementById('root'),
	board: board,
})





// board.createSimpleGrid();
board.createGrid();

board.dramaticEntry()
	.then(function(){
		renderer.attachControls();
	});
board.setMeshPositionDeep();



const bot = require('./components/bot.js');

bot(board);


setTimeout(function(){
	board.requestMove();
}, 4000)
