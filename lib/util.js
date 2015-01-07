var CronJob = require('cron').CronJob;
var moment = require('moment');
var storage = require('./storage');
var arduino = require('../app');
var web = require('../web');

function getDados(){
	dia = moment().format('DD/MM');
	var dados = {};
	dados.dia = dia;
	dados.umidade = arduino.getUmid();

	return dados;
}

function salvaDados(){
	console.log("Atualiza dados ");
	var dataTime = storage.getFile('./lib/configs/time.json', true);
	console.log(dataTime);
	var job = new CronJob('00 '+ dataTime.minuto +' '+ dataTime.hora +' * * 1-6', function(){
		
		var oldDados = storage.getFile('./lib/configs/dados.json', true);
		var newDados = getDados();
		if(oldDados.length < dataTime.maxDados){
			oldDados.push(newDados);
			oldDados = JSON.stringify(oldDados);
			storage.setFile('./lib/configs/dados.json', oldDados);
		}else{
			var data = JSON.stringify(newDados);
			storage.setFile('./lib/configs/dados.json', data);
		}	
		var dados = storage.getFile('./lib/configs/dados.json');
		web.emit('dadosGrafico', dados);
		console.log("atualizados");
	},true, "Brazil/Brasilia");
}

module.exports = {
	rodarCron: function(){
		salvaDados();
	}
}