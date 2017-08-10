import React, { Component } from 'react';
import './ProjectPicker.css';

const _ = require('lodash');
const projectService = require('../../services/projectService');


class ProjectPicker extends Component {

    constructor(props){
        super(props);
        const scope = this;

        _.defaults(scope, {

            state: {
                projects: []
            },

            componentDidMount: function(){
                return projectService.getAll()
                    .then((projects)=>{
                        scope.setState({
                            projects: projects
                        })
                    })
            },

            render: function(){
                return (
                    <div>
                        {scope.renderProjects()}
                    </div>
                );
            },

            renderProjects: function(){
                return scope.state.projects.map(scope.renderProject);
            },

            renderProject: function(project){
                return (
                    <div key={project.id} onClick={_.partial(scope.props.onPick, project)}>
                        <div>
                            {project.name}
                        </div>
                    </div>
                )
            },
        })
    }

}

export default ProjectPicker;
