require('babel-register')({});
require('babel-polyfill');


const DockerSpawner = require('./DockerSpawner.js');
const SocketConnector = require('./SocketConnector.js');

const dockerSpawner = DockerSpawner();
const socketConnector = SocketConnector();

dockerSpawner.init()
	.then(socketConnector.init);

