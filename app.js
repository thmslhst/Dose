/*
*
* @author >> Thomas Lhoest - tlhoest@gmail.com
*
* */

const SERVER_PORT = 8080;
const IN_PORT = 5000;

//-> server

var http = require('http');
var fs = require('fs');
var url = require("url");

var server = http.createServer(function(req, res){

	var page = url.parse(req.url).pathname;

	if (page == '/'){
		fs.readFile('views/home.html', 'utf-8', function(error, content){
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(content);
		});
	}
	else{
		fs.readFile('views'+page+'.html', 'utf-8', function(error, content){
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(content);
		});
	}
	
});

//-> osc receiver

var oscReceiver = require('osc-receiver'),
    receiver = new oscReceiver();

receiver.bind(IN_PORT);

//-> socket io

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    receiver.on('message', function() {
        socket.emit('receive-osc', arguments);
    });
});

var port = Number(process.env.PORT || SERVER_PORT);
server.listen(port, function() {
    console.log("Listening on " + port);
});
