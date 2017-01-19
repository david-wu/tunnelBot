angular.module('Main')
    .directive('visualizer', [
        '$timeout',
        NoteEditor
    ]);

function NoteEditor($timeout){
    return {
        scope: {},
        template: '',
        link: linkFunc.bind(null, $timeout),
    };
}

function linkFunc($timeout, scope, element, attrs){

    const THREE = require('three-js')();
    require('./lib/CSS3DRenderer.js')(THREE);
    require('./lib/TrackBallControls.js')(THREE);

    const Renderer = require('./Renderer.js');
    const Board = require('./models/Board.js');
    const bot = require('./bot.js');


    const rootEl = element[0];//document.getElementById('root')

    // var style = window.getComputedStyle(rootEl, null);
    // const width = parseInt(style.getPropertyValue('width'))
    // const height = parseInt(style.getPropertyValue('height'))

    const renderer = new Renderer({
        // width: width,
        // height: height,
        context: rootEl,
    })
    const board1 = new Board({
        pos: {
            x: -4500,
        }
    });
    const board2 = new Board({
        pos: {
            x: 4500,
        }
    });


    renderer.setBoard(board1)
    renderer.setBoard(board2)

    board1.createGrid();
    board1.setMeshPositionDeep();

    board2.createGrid();
    board2.setMeshPositionDeep();

    bot(board1);
    bot(board2);

    renderer.dramaticEntry()
        .then(function(){
            renderer.attachControls();
        })

    setTimeout(function(){
        board1.requestMove();
        board2.requestMove();
    }, 4000)








}
