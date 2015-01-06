var moment = require('moment'),
storage = require('./storage.js'),
CronJob = require('cron').CronJob,
web = require('../web.js'),
arduino = require('../arduino.js'),
dia,
hora,
umidade;

function salvaDados(save){
	dia = moment().format('DD/MM')
	hora = moment().format('HH:ss');
	segundos = moment().format("ss");

	var map = [];
	var dados = {};
	dados.dia = hora;
	dados.umidade = arduino.getUmidade();
	console.log(dados.umidade);
	if(!save) {
		return dados;
	}

	map.push(dados);
	var data = JSON.stringify(map);
	storage.setFile('./lib/configs/dados.json', data);
	atualizaDados();
}
function atualizaDados(){
	var job = setInterval(function(){
		
		var oldDados = storage.getFile('./lib/configs/dados.json', true);
		var newDados = salvaDados();
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
	},3000);
};


module.exports = {
	salvaDados: function(save){
		atualizaDados();
	}
}