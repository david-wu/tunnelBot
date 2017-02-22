require('babel-register')({});
require('babel-polyfill');


const DockerSpawner = require('./workManager/DockerSpawner.js');
const SocketConnector = require('./workManager/SocketConnector.js');

const socketConnector = SocketConnector();
const dockerSpawner = DockerSpawner();

dockerSpawner.init()
	.then(socketConnector.init);

