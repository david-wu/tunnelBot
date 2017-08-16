import React, { Component } from 'react';
import './App.css';
import FilePicker from './components/FilePicker/FilePicker';
import DirPicker from './components/DirPicker/DirPicker';


const _ = require('lodash');
const fileService = require('./services/fileService')


class App extends Component {

    constructor(props){
        super(props)
        const scope = this

        _.defaults(scope, {

            state: {
                selectedFile: undefined,
                selectedDir: undefined,
            },

            onFilePick: function(file){
                scope.setState({
                    selectedFile: scope.state.selectedFile === file ? undefined : file
                })
            },

            onDirPick: function(dir){
                scope.setState({
                    selectedDir: scope.state.selectedDir === dir ? undefined : dir
                })
            },

            render: function(){
                return (
                    <div className="picker-viewer">
                        <div className="pickers">
                            {scope.renderDirPicker()}
                            {scope.renderFilePicker()}
                        </div>
                        <div className="viewer">
                            <div>{!!scope.state.selectedFile && scope.state.selectedFile.name}</div>
                        </div>
                    </div>
                );
            },

            renderDirPicker: function(){
                return (
                    <div>
                        {scope.renderSelectionHeader(scope.state.selectedDir)}
                        <DirPicker selectedDir={scope.state.selectedDir} onPick={scope.onDirPick} />
                    </div>
                )
            },

            renderFilePicker: function(){
                if(!scope.state.selectedDir){return;}
                return (
                    <div>
                        {scope.renderSelectionHeader(scope.state.selectedFile)}
                        <FilePicker selectedFile={scope.state.selectedFile} parentDir={scope.state.selectedDir} onPick={scope.onFilePick} />
                    </div>
                )
            },

            renderSelectionHeader: function(selection){
                if(selection){
                    return (
                        <div className="selection selected">
                            {selection.name}
                        </div>
                    )
                }else{
                    return (
                        <div className="selection">
                        </div>
                    )
                }
            },
        })

    }

}

export default App;
