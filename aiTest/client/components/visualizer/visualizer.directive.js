angular.module('Main')
    .directive('visualizer', [
        '$timeout',
        NoteEditor
    ]);

function NoteEditor($timeout){
    return {
        scope: {
            customBot: '=?',
        },
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
    const myBot = require('./myBot.js');


    const renderer = new Renderer({
        width: element.innerWidth(),
        height: element.innerHeight(),
        context: element[0],
    })
    const board1 = new Board({
        pos: {
            x: -4000,
        }
    });
    const board2 = new Board({
        pos: {
            x: 4000,
        }
    });


    renderer.setBoard(board1)
    renderer.setBoard(board2)

    board1.createGrid();
    board1.setMeshPositionDeep();

    board2.createGrid();
    board2.setMeshPositionDeep();

    bot(board1);
    myBot(board2);

    renderer.dramaticEntry()
        .then(function(){
            renderer.attachControls();
        })

    setTimeout(function(){
        board1.requestMove();
        board2.requestMove();
    }, 4000)


    // function useBot(board, bot){
    //     board.removeAllListeners('requestMove');
    //     bot(board)
    // }


    // scope.$watch('customBot', function(customBot){
    //     if(!customBot){return;}
    //     try{
    //         const userBot = eval('('+customBot+')')
    //         console.log(userBot)
    //         if(userBot){
    //             useBot(board2, userBot);
    //         }
    //     }catch (e){
    //         console.log('Bad code', e)
    //     }
    // })






}
