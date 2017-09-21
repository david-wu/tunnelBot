const port = process.env.PORT || 10001;

module.exports = {
    server: {
        prototcol: 'http',
        domain: 'localhost',
        port: port
    },
    url: function(){
        return this.server.protocol + '://' + this.server.domain + (this.server.port ? ':' + this.server.port : '')
    }
}