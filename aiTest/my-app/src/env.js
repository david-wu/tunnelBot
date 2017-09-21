const port = 10001;

module.exports = {
    server: {
        protocol: 'http',
        domain: 'localhost',
        port: port
    },
    url: function(){
        return this.server.protocol + '://' + this.server.domain + (this.server.port ? ':' + this.server.port : '')
    }
}