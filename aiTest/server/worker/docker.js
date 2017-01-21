// var fs = require('fs')
// var Docker = require('dockerode');
// var docker = new Docker({socketPath: '/var/run/docker.sock'});
// var docker = new Docker(); //defaults to above if env variables are not used

var exec = require('./exec.js');



function buildImage(){
	return exec('docker build . -t worker_app');
}

function buildContainer(){
	return exec('docker run -d --name myWorkerApp worker_app');
}


buildImage()
	.then(buildContainer)
	.then(console.log)
	.catch(console.log)

// // var docker = new Docker({host: 'http://192.168.1.10', port: 3000});
// // var docker = new Docker({protocol:'http', host: '127.0.0.1', port: 3000});
// // var docker = new Docker({host: '127.0.0.1', port: 3000}); //defaults to http

// //protocol http vs https is automatically detected
// // var docker5 = new Docker({
// //   host: '192.168.1.10',
// //   port: process.env.DOCKER_PORT || 2375,
// //   ca: fs.readFileSync('ca.pem'),
// //   cert: fs.readFileSync('cert.pem'),
// //   key: fs.readFileSync('key.pem')
// // });

// // var docker6 = new Docker({
// //   protocol: 'https', //you can enforce a protocol
// //   host: '192.168.1.10',
// //   port: process.env.DOCKER_PORT || 2375,
// //   ca: fs.readFileSync('ca.pem'),
// //   cert: fs.readFileSync('cert.pem'),
// //   key: fs.readFileSync('key.pem')
// // });

// // var container = docker.getContainer('71501a8ab0f8');

// // query API for container info
// // container.inspect(function (err, data) {
// //   console.log(err, data);
// // });

// // container.start(function (err, data) {
// //   console.log(err, data);
// // });

// // container.remove(function (err, data) {
// //   console.log(err, data);
// // });


// docker.listContainers(function (err, containers) {
//   console.log('err', err);
//   console.log('containers', containers);
//   containers.forEach(function (containerInfo) {
//     docker.getContainer(containerInfo.Id).stop(cb);
//   });
// });


// docker.createContainer({Image: 'ubuntu', Cmd: ['/bin/bash']}, function (err, container) {
// console.log('cat')
// console.log(err, container)
//   // container.start(function (err, data) {
//   //   //...
//   //   console.log(err, data)
//   // });
// });
