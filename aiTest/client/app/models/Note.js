

class Note{

    constructor(options){
        _.extend(this, options)
        _.defaults(this, {
            content: '',
            access: 'private',
            tags: [],
        });
    }

    setContent(content){
        if(this.content === content){return;}
        this.content = content;
        this.lastModified = Date.now();
        this.updateTags();
    }

    updateTags(){
        this.tags = this.content.match(/#(\S+)/gm);
    }

}

module.exports = Note;