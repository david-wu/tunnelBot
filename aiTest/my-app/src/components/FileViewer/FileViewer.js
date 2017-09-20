import _ from 'lodash';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import * as moment from 'moment';
import * as Uuid from 'uuid';

import './FileViewer.css';

const ace = window.ace;

@observer
class FileViewer extends Component{

    constructor(props){
        super(props)
        this.debouncedPutFile = _.debounce(this.putFile, 200)
        this.id = Uuid()
    }

    @autobind
    mountAceEditor(element){
        this.aceEditor = ace.edit(element)
        this.aceEditor.$blockScrolling = Infinity
        this.aceEditor.setOptions(editorOptions)
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props){
        const fileSession = new ace.EditSession(props.fileNode.model.content)
        fileSession.setMode('ace/mode/javascript')
        fileSession.on('change', this.aceSessionChangeHandler)

        props.fileNode.modelConnector.on('contentDiff', (delta)=>{
            if(delta.viewerId !== this.id){
                this._silentChange = true;
                fileSession.getDocument().applyDeltas([delta])
                this._silentChange = false;
            }
        })


        this.aceEditor.setSession(fileSession)
    }

    @autobind
    aceSessionChangeHandler(diff){
        const fileNode = this.props.fileNode
        fileNode.model.content = this.aceEditor.getValue()

        if(!this._silentChange){
            diff.viewerId = this.id
            fileNode.modelConnector.emitAll('contentDiff', diff)

            this.debouncedPutFile(fileNode.model)
        }
    }

    @autobind
    onFileNameChange(e){
        const file = this.props.fileNode.model
        file.name = e.target.value
        this.debouncedPutFile(file)
    }

    @autobind
    putFile(file){
        file.put()
    }

    @autobind
    deleteFile(){
        this.props.fileNode.destroy();
    }

    render(){

        // if(this.aceEditor && this.aceEditor.session){
        //     var pos = this.aceEditor.session.selection.toJSON()
        //     this._silentChange = true;
        //     this.aceEditor.session.setValue(this.props.fileNode.model.content)
        //     this._silentChange = false;
        //     this.aceEditor.session.selection.fromJSON(pos)
        // }

        const createdAgo = moment(new Date(this.props.fileNode.model.createdAt)).fromNow()
        const updatedAgo = moment(new Date(this.props.fileNode.model.updatedAt)).fromNow()
        return (
            <div>
                <div>
                    <button onClick={this.deleteFile}>Delete</button>
                </div>
                <div>
                    <span className="field-tip">
                        created {createdAgo}
                        <span className="tip-content">
                            {moment(this.props.fileNode.model.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                        </span>
                    </span>

                    <span className="field-tip">
                        last updated {updatedAgo}
                        <span className="tip-content">
                            {moment(this.props.fileNode.model.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                        </span>
                    </span>

                </div>
                <div>
                    <input value={this.props.fileNode.model.name} type="text" onChange={this.onFileNameChange} />
                </div>
                <div>
                    <div style={{width:'500px', height:'500px', position:'relative', flex: '1 0 0'}} ref={this.mountAceEditor}></div>
                </div>
            </div>
        )
    }

}

const editorOptions = {
    theme: 'ace/theme/monokai',
    maxLines: Infinity,
    showGutter: true,
    showPrintMargin: false,
}

export default FileViewer;
