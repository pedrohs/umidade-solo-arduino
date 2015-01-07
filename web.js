var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var arduino = require('./app');
var storage = require('./lib/storage');

app.use(express.static(__dirname + '/view'));
app.get('/', function(req, res){
	res.send(__dirname + '/view/index.html');
});

server.listen(port, function(){
	console.log("Servidor HTTP Online");
});

io.on('connection', function(socket){
	console.log("Usuario conectado");

	socket.emit('releGetConfig', storage.getFile('./lib/configs/rele.json', true));
	
	socket.emit('dadosGrafico', storage.getFile('./lib/configs/dados.json'));
	
	socket.on('releConfig', function(data){
		var dados = JSON.stringify(data)
		storage.setFile('./lib/configs/rele.json', dados);
		arduino.rele();
	});

	socket.on('setTime', function(data){
		var dados = JSON.stringify(data)
		storage.setFile('./lib/configs/time.json', dados);
		util.rodarCron();
	});
});

module.exports = (io);
var util = require('./lib/util');