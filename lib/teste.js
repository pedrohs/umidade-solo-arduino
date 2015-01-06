var moment = require('moment'),
storage = require('./storage'),
CronJob = require('cron').CronJob,
web = require('../web'),
arduino = require('../arduino'),
dia,
hora,
umidade;

function dados(){
	dia = moment().format('DD/MM');
	var dados = {};
	dados.dia = dia;
	dados.umidade = arduino.getUmidade();
	return dados;
}
function atualizaDados(){
	console.log("Atualiza dados ");
	var data = storage.getFile('./lib/configs/time.json', true);
	var job = new CronJob('00 '+ data.minuto +' '+ data.hora +' * * 1-6', function(){
		
		var oldDados = storage.getFile('./lib/configs/dados.json', true);
		var newDados = dados();
		if(oldDados.length < 10){
			oldDados.push(newDados);
			oldDados = JSON.stringify(oldDados);
			storage.setFile('./lib/configs/dados.json', oldDados);
		}else{
			var map = [];
			map.push(newDados);
			var data = JSON.stringify(map);
			storage.setFile('./lib/configs/dados.json', data);
		}	
		web.enviaGrafico();
		console.log("atualizados");
	},true, "Brazil/Brasilia");
}

module.exports = {
	salvaDados: function(){
		atualizaDados();
		console.log("executado");
	},
	umidade: function(value){
		umidade = value;
	}
}