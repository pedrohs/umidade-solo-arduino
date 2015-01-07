var CronJob = require('cron').CronJob;
var moment = require('moment');
var storage = require('./storage');
var arduino = require('../app');
var web = require('../web');

function dados(){
	dia = moment().format('DD/MM');
	var dados = {};
	dados.dia = dia;
	dados.umidade = arduino.getUmid();

	return dados;
}

function cron(){
	var cronTime = storage.getFile('./lib/configs/time.json');
	var job = new CronJob('00 '+ cronTime.minuto +' '+ cronTime.hora +' * * 1-6', function(){
		
		var oldDados = storage.getFile('./lib/configs/dados.json', true);
		var newDados = dados();
		if(oldDados.length <= cronTime.maxDados){
			oldDados.push(newDados);
			oldDados = JSON.stringify(oldDados);
			storage.setFile('./lib/configs/dados.json', oldDados);
		}else{
			newDados = JSON.stringify(newDados);
			storage.setFile('./lib/configs/dados.json', newDados);
		}
		web.emit('dadosGrafico', storage.getFile('./lib/configs/dados.json'));

	},true, "Brazil/Brasilia");
}