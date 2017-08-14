import React, { Component } from 'react';
import './FilePicker.css';

const _ = require('lodash');
const fileService = require('../../services/fileService');


class FilePicker extends Component {

    constructor(props){
        super(props);
        const scope = this;

        _.defaults(scope, {

            state: {
                files: []
            },

            componentDidMount: function(){
                return fileService.getAll()
                    .then((files)=>{
                        scope.setState({
                            files: files
                        })
                    })
            },

            render: function(){
                return (
                    <div>
                        {scope.renderFiles()}
                    </div>
                );
            },

            renderFiles: function(){
                return scope.state.files.map(scope.renderFile);
            },

            renderFile: function(file){
                return (
                    <div className="clickable" key={file.id} onClick={_.partial(scope.props.onPick, file)}>
                        <div>
                            {file.name}
                        </div>
                    </div>
                )
            },
        })
    }

}

export default FilePicker;
