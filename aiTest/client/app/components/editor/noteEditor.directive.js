
// angular.module('Main')
//     .directive('noteEditor', [
//         '$timeout',
//         '$interval',
//         NoteEditor
//     ]);

// function NoteEditor($timeout, $interval){
//     return {
//         scope: {
//             note: '=?',
//         },
//         template: require('./noteEditor.tpl.html'),
//         link: linkFunc.bind(null, $timeout, $interval),
//     };
// }

// function linkFunc($timeout, $interval, scope, element, attrs){

//     const context = element[0];

//     var editor = ace.edit(context);
//     // editor.$blockScrolling = Infinity;

//     editor.setOptions({
//         theme: 'ace/theme/monokai',
//         maxLines: Infinity,
//         showGutter: true,
//         showPrintMargin: false,
//     });

//     if(scope.note){
//         editor.setValue(scope.note.content);
//         editor.clearSelection();
//     }

//     var editSession = editor.getSession();
//     editSession.setMode('ace/mode/javascript');
//     editSession.on('change', function(){
//         if(scope.note){
//             scope.note.setContent(editor.getValue());
//         }
//         $timeout(_.noop);
//     });

//     scope.$watch('note', function(note, prevNote){
//         if(prevNote === note){return;}
//         if(note){
//             editor.setValue(note.content);
//             editor.clearSelection();
//         }
//     });



//     function getDimensions(){
//         return {
//             width: element.innerWidth(),
//             height: element.innerHeight(),
//         }
//     }

//     const dimensions = getDimensions();
//     $interval(function(){
//         const newDimensions = getDimensions();
//         if(!_.isMatch(dimensions, newDimensions)){
//             editor.resize(true);
//             _.extend(dimensions, newDimensions)
//         }
//     }, 200)


// }
