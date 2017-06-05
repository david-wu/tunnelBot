// angular.module('Main')
//     .directive('visualizer', [
//         '$timeout',
//         Visualizer
//     ]);

// function Visualizer($timeout){
//     return {
//         scope: {
//             customBot: '=?',
//         },
//         template: '',
//         link: linkFunc.bind(null, $timeout),
//     };
// }

// function linkFunc($timeout, scope, element, attrs){

//     const THREE = require('three-js')();
//     require('./lib/CSS3DRenderer.js')(THREE);
//     require('./lib/TrackBallControls.js')(THREE);

//     const Renderer = require('./Renderer.js');
//     const Board = require('./models/Board.js');
//     const bot1 = require('./bot1.js');
//     const bot2 = require('./bot2.js');

//     const renderer = new Renderer({
//         width: element.innerWidth(),
//         height: element.innerHeight(),
//         context: element[0],
//     })
//     const board1 = new Board({
//         pos: {
//             x: -3500,
//         }
//     })
//     const board2 = new Board({
//         pos: {
//             x: 3500,
//         }
//     })

//     renderer.setBoard(board1)
//     renderer.setBoard(board2)

//     bot1(board1)
//     bot2(board2)

//     board1.restartGame()
//     board2.restartGame()

//     renderer.dramaticEntry()
//         .then(function(){
//             renderer.attachControls()
//         })
// }
