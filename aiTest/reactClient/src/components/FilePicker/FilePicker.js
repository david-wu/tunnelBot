import React, { Component } from 'react';
import './FilePicker.css';

const _ = require('lodash');
const fileService = require('../../services/fileService');
const FontAwesome = require('react-fontawesome');

class FilePicker extends Component {

    constructor(props){
        super(props);
        const scope = this;

        _.defaults(scope, {

            state: {
                files: [],
                newFile: {
                    name: '',
                    dirIds: [scope.props.parentDir.id]
                }
            },

            componentDidMount: function(){
                scope.setFiles(scope.props.parentDir.id)
            },

            componentWillReceiveProps: function(newProps){
                if(newProps.parentDir.id !== scope.props.parentDir.id){
                    scope.setFiles(newProps.parentDir.id);
                }
            },

            changeNameHandler: function(event){
                scope.setState({
                    newFile: {
                        name: event.target.value,
                        dirIds: [scope.props.parentDir.id]
                    }
                })
            },

            setFiles: function(dirId){
                return fileService.getAll({
                    dirId: dirId
                })
                    .then((files)=>{
                        scope.setState({
                            files: files
                        })
                    })
            },

            onCreate: function(){
                return fileService.factory(scope.state.newFile).post()
                    .catch(console.log)
                    .then(function(file){
                        scope.setState(function(prevState){
                            prevState.newFile.name = ''
                            prevState.files.push(file)
                            return prevState;
                        })
                    })
            },

            render: function(){
                return (
                    <div>
                        <button onClick={scope.onCreate}>
                            + Create File
                        </button>
                        <input value={scope.state.newFile.name}
                            type="text"
                            onChange={scope.changeNameHandler}
                            placeholder="fileName"
                        ></input>
                        {scope.renderFiles()}
                    </div>
                );
            },

            renderFiles: function(){
                return scope.state.files.map(scope.renderFile);
            },

            renderFile: function(file){
                const fileClass = _.get(scope, 'props.selectedFile.id') === file.id ? 'file-item clickable selected-file' : 'file-item clickable';
                return (
                    <div className={fileClass} key={file.id} onClick={_.partial(scope.props.onPick, file)}>
                        <FontAwesome name='file' />
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

// import React, { Component } from 'react';
// import './FilePicker.css';

// const _ = require('lodash');
// const fileService = require('../../services/fileService');


// class FilePicker extends Component {

//     constructor(props){
//         super(props);
//         const scope = this;

//         _.defaults(scope, {

//             state: {
//                 files: []
//             },

//             componentDidMount: function(){
//                 return fileService.getAll()
//                     .then((files)=>{
//                         scope.setState({
//                             files: files
//                         })
//                     })
//             },

//             render: function(){
//                 return (
//                     <div>
//                         {scope.renderFiles()}
//                     </div>
//                 );
//             },

//             renderFiles: function(){
//                 return scope.state.files.map(scope.renderFile);
//             },

//             renderFile: function(file){
//                 return (
//                     <div className="clickable" key={file.id} onClick={_.partial(scope.props.onPick, file)}>
//                         <div>
//                             {file.name}
//                         </div>
//                     </div>
//                 )
//             },
//         })
//     }

// }

// export default FilePicker;
