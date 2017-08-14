import React, { Component } from 'react';
import './DirPicker.css';

const _ = require('lodash');
const dirService = require('../../services/dirService');


class DirPicker extends Component {

    constructor(props){
        super(props);
        const scope = this;

        _.defaults(scope, {

            state: {
                dirs: [],
                newDir: {
                    name: ''
                }
            },

            componentDidMount: function(){
                return dirService.getAll()
                    .then((dirs)=>{
                        scope.setState({
                            dirs: dirs
                        })
                    })
            },

            changeNameHandler: function(event){
                scope.setState({
                    newDir: {
                        name: event.target.value
                    }
                })
            },

            onCreate: function(){
                return dirService.factory(scope.state.newDir).post()
                    .then(function(dir){
                        scope.setState(function(prevState){
                            prevState.newDir.name = ''
                            prevState.dirs.push(dir)
                            return prevState;
                        })
                    })
                    .catch(console.log)
            },

            render: function(){
                return (
                    <div>
                        <button onClick={scope.onCreate}>
                            + Create Dir
                        </button>
                        <input value={scope.state.newDir.name}
                            type="text"
                            onChange={scope.changeNameHandler}
                            placeholder="dirName"
                        ></input>
                        {scope.renderDirs()}
                    </div>
                );
            },

            renderDirs: function(){
                return scope.state.dirs.map(scope.renderDir);
            },

            renderDir: function(dir){
                const dirClass = _.get(scope, 'props.selectedDir.id') === dir.id ? 'clickable selected-dir' : 'clickable';
                return (
                    <div className={dirClass} key={dir.id} onClick={_.partial(scope.props.onPick, dir)}>
                        <div>
                            {dir.name}
                        </div>
                    </div>
                )
            },
        })
    }

}

export default DirPicker;
