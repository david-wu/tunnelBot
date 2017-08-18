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

            componentWillMount: function(){
                scope.debouncedPutFile = _.debounce(scope.putFile, 300);
            },

            onEditorContainer: function(element){
                scope.aceEditor = ace.edit(element)
                scope.aceEditor.$blockScrolling = Infinity
                scope.aceEditor.setOptions({
                    theme: 'ace/theme/monokai',
                    maxLines: Infinity,
                    showGutter: true,
                    showPrintMargin: false,
                })

                var editSession = scope.aceEditor.getSession()
                editSession.setMode('ace/mode/javascript')
                editSession.on('change', ()=>{
                    scope.file.content = scope.aceEditor.getValue()
                    scope.debouncedPutFile();
                });

                scope.componentWillReceiveProps(scope.props);
            },

            // wraper befcause scope.file can change
            putFile: function(){
                scope.file.put()
            },

            componentWillReceiveProps: function(newProps){
                if(newProps.file.id){
                    scope.file = newProps.file;
                    scope.aceEditor.setValue(scope.file.content || '')
                    scope.aceEditor.clearSelection()
                }
            },

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
