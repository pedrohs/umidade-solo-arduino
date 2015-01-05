var express = require('express'),
app = express(),
server = require('http').Server(app),
fs = require('fs'),
io = require('socket.io')(server),
port = process.env.PORT || 3000,
storage = require('./lib/storage.js'),
arduino = require('./arduino.js');


app.use(express.static(__dirname + '/view'));
app.get('/', function(req, res){
	res.send(__dirname + '/view/index.html');
});

server.listen(port, function(){
	console.log("Servidor HTTP Online");
});
io.on('connection', function(socket){
	var dados = storage.getFile('./lib/configs/dados.json');
	socket.emit('dadosGrafico', dados);

	socket.on('releConfig', function(dados){
		var data = JSON.stringify(dados);
		storage.setFile('./lib/configs/rele.json', data);
	});
});


module.exports = {
	enviaDados: function(value){
		io.emit('dados', value);
	},
	enviaGrafico: function(){
		var dados = storage.getFile('./lib/configs/dados.json');
		io.emit('dadosGrafico', dados);
		io.emit('graficoUpdate', {});
	}
}