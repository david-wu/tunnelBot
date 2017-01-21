
const express = require('express');
const http = require('http');


const app = express();
app.use('/', express.static('./'))


const port = 80
const server = http.createServer(this.express);
server.listen(80, (err, response)=>{
	console.log('listening on '+80)
	// if(err){
	// 	rej(err)
	// }else{
	// 	res('listening on '+80, response);
	// }
});

