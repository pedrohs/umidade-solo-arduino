var five = require('johnny-five');
var arduino = new five.Board();
var DataStore = require('nedb');
var connect = require('connect');
var connectRoute = require('connect-route');
var serveStatic = require('serve-static');
var app = connect();
var http = require('http').createServer(app);
var fs = require('fs');
var io = require('socket.io')(http);

var db = new DataStore({filename: 'database.db', autoload: true});
var Fn = five.Fn;
var rele;

require('./init/db.js')(app, db);
require('./init/cron.js')(app, db);

app.use(serveStatic("front/"));
app.cronJob();

arduino.on('ready', function(){
	console.log("Arduino Pronto");

	//sensor higrômetro
	var sensor = new five.Sensor("A0");

	//verifica se o rele esta ligado ou não no banco de dados
	if(app.rele.status){
		rele = new five.Pin(app.rele.porta);
	}

	sensor.on('data', function(){
		app.valor = Fn.map(this.value, 0, 1023, 100, 0);
		releAction(app.valor);
		io.emit('umidade real', app.valor);
	});
});

//controla o liga/desliga do rele
function releAction(porcent){
	if(app.rele.status){
		if(porcent <= app.rele.porcent){
			rele.high();
		}else{
			rele.low();
		}
	}
};

//Rotas
app.use(connectRoute(function(router){
	router.get('/', function(req, res, next){
		res.end(fs.readFileSync('view/index.html'));
	});
	router.get('/dados', function(req, res, next){
		db.find({type: 'dados'}).sort({ dia: 1 }).exec(function(err, data){
			var dias = [];
			var porcents = [];
			var dados = [];
			for (var i = 0; i < data.length; i++) {
				dias.push(data[i].dia);
				porcents.push(data[i].porcent);
			};
			dados.push(dias);
			dados.push(porcents);

			res.end(JSON.stringify(dados));
		});
	});
}));

//Socket.io
io.on('connection', function(socket){
	console.log("Conectado");
	socket.emit('umidade real', app.valor);
	socket.emit('rele config', app.rele);

	socket.on('set cron', function(cron){
		db.update({type: 'cron'}, {type: 'cron', hora: cron.hora, minuto: cron.minuto, maxDados: cron.maxDados}, {}, function(err){
			if(err){return console.log(err)}
				app.cronJob();
		});
	});

	socket.on('rele config', function(releConfig){
		if(releConfig.status){
			db.update({type: 'ConfigRele'}, {type: 'ConfigRele', status: releConfig.status, porta: releConfig.porta, porcent: releConfig.porcent}, function(err){
				if(err){return console.log(err)};
				db.findOne({type: 'ConfigRele'}, function(err, data){
					if(err){return console.log(err)};
					app.rele = data;
				});
			});
		}else{
			db.update({type: 'ConfigRele'}, {type: 'ConfigRele', status: releConfig.status}, {}, function(err){
				if(err){return console.log(err)};
				db.findOne({type: 'ConfigRele'}, function(err, data){
					if(err){return console.log(err)};
					app.rele = data;
					rele.query(function(state) {
						if(state.value == 1){
							rele.low();
						}
					});
				});
			});
		}
	});

	db.findOne({type: "cron"}, function(err, dados){
		if(err){return console.log(err)}
			socket.emit('cron config', dados);
	});
});

http.listen(4000, function(){
	console.log("Servidor http Online");
});