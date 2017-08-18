import React, { Component } from 'react';
import './FileViewer.css';

const _ = require('lodash');

const fileService = require('../../services/fileService');
const FontAwesome = require('react-fontawesome');
const ace = window.ace;


class FileViewer extends Component {

    constructor(props){
        super(props);
        const scope = this;

        _.defaults(scope, {

            state: {
            },

            componentDidMount: function(){

            },

            onEditorContainer: function(element){
                scope.editorContainer = element

                // const context = elementRef.nativeElement
                scope.aceEditor = ace.edit(element)
                scope.aceEditor.$blockScrolling = Infinity;
                scope.aceEditor.setOptions({
                    theme: 'ace/theme/monokai',
                    maxLines: Infinity,
                    showGutter: true,
                    showPrintMargin: false,
                })

                var editSession = scope.aceEditor.getSession()
                editSession.setMode('ace/mode/javascript')
                editSession.on('change', ()=>{
                    scope.props.file.content = scope.aceEditor.getValue()
                    // scope.selectedFileContentChange.emit(scope.selectedFile)
                    scope.props.file.put();
                });

                scope.componentWillReceiveProps(scope.props);
            },

            componentWillReceiveProps: function(newProps){
                console.log('newProps', newProps);
                if(newProps.file.id){
                    console.log('setValue', newProps.file.content || '');
                    scope.aceEditor.setValue(newProps.file.content || '')
                    scope.aceEditor.clearSelection()
                }
            },

            // }

            // ngOnChanges(change){
            //     // scope.aceEditor.resize(true);
            //     if(change.selectedFile){
            //         scope.aceEditor.setValue(change.selectedFile.currentValue.content || '')
            //         scope.aceEditor.clearSelection()
            //     }
            // }


            render: function(){
                return (
                    <div>
                        <div style={{width:'500px', height:'500px', position:'relative', flex: '1 0 0'}} ref={scope.onEditorContainer}></div>
                    </div>
                );
            },



        })
    }

}

export default FileViewer;
