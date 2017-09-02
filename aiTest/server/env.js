module.exports = {
    server: {
        prototcol: 'http',
        domain: 'localhost',
        port: 10001
    },
    url: function(){
        return this.server.protocol + '://' + this.server.domain + (this.server.port ? ':' + this.server.port : '')
    }
}