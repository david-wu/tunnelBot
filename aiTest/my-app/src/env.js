const port = 10001;

module.exports = {
    server: {
        protocol: 'http',
        domain: 'localhost',
        port: port
    },
    url: function(){
        if(process.env.APP_ENV === 'BUILD'){
            console.log('build')
            return '';
        }
        return this.server.protocol + '://' + this.server.domain + (this.server.port ? ':' + this.server.port : '')
    }
}