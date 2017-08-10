import React, { Component } from 'react';
import './App.css';
import FilePicker from './components/FilePicker/FilePicker';
import ProjectPicker from './components/ProjectPicker/ProjectPicker';


const _ = require('lodash');
const fileService = require('./services/fileService')


class App extends Component {

    constructor(props){
        super(props)
        const scope = this

        _.defaults(scope, {

            state: {
                selectedFile: undefined,
                selectedProject: undefined,
            },

            onFilePick: function(file){
                scope.setState({
                    selectedFile: scope.state.selectedFile === file ? undefined : file
                })
            },
            onProjectPick: function(project){
                scope.setState({
                    selectedProject: scope.state.selectedProject === project ? undefined : project
                })
            },

            renderProjects: function(){
                return (
                    <div>
                        {scope.renderSelectionHeader(scope.state.selectedProject)}
                        <ProjectPicker onPick={scope.onProjectPick} />
                    </div>
                )
            },

            renderFiles: function(){
                if(!scope.state.selectedProject){return;}
                return (
                    <div>
                        {scope.renderSelectionHeader(scope.state.selectedFile)}
                        <FilePicker onPick={scope.onFilePick} />
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

            render: function(){
                return (
                    <div>
                        <div className="pickers">
                            {scope.renderProjects()}
                            {scope.renderFiles()}
                        </div>

                        <div className="viewer">
                            {!!scope.state.selectedFile && <div>{scope.state.selectedFile.name}</div>}
                        </div>
                    </div>
                );
            },
        })

    }

}

export default App;
