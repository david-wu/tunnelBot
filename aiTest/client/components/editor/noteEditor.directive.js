
angular.module('Main')
    .directive('noteEditor', [
        '$timeout',
        NoteEditor
    ]);

function NoteEditor($timeout){
    return {
        scope: {
            note: '=?',
        },
        template: require('./noteEditor.tpl.html'),
        link: linkFunc.bind(null, $timeout),
    };
}

function linkFunc($timeout, scope, element, attrs){

    var editor = ace.edit(element[0]);
    editor.$blockScrolling = Infinity;

    editor.setOptions({
        theme: 'ace/theme/monokai',
        maxLines: Infinity,
        showGutter: true,
        showPrintMargin: false,
    });

        console.log(scope.note)
    if(scope.note){
        editor.setValue(scope.note.content);
        editor.clearSelection();
    }

    var editSession = editor.getSession();
    editSession.on('change', function(){
        if(scope.note){
            scope.note.setContent(editor.getValue());
        }
        $timeout(_.noop);
    });

    scope.$watch('note', function(note, prevNote){
        if(prevNote === note){return;}
        if(note){
            editor.setValue(note.content);
            editor.clearSelection();
        }
    });


    // Selects the textEl when enter key is pressed
    // $('body').on('keydown', changeSelection);
    // scope.$on('$destroy', function(){
    //     $('body').off('keydown', changeSelection);
    // });
    // function changeSelection(e){
    //     if(e.keyCode===13){
    //         var textEl = element.find('textarea')
    //         if(!textEl.is(':focus')){
    //             textEl.focus();
    //             e.preventDefault();
    //         }
    //     }
    // }


}
