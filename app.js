var five = require('johnny-five');
var arduino = new five.Board();
var storage = require('./lib/storage');
var umidade;
var releTime;
var releConfig = storage.getFile('./lib/configs/rele.json', true);
var rele;

arduino.on('ready', function(){
	console.log("Arduino Pronto");

	var sensor = new five.Sensor({
		pin: "A0",
		freq: 250
	});

	if(releConfig.status){
		rele = new five.Pin(releConfig.portaRele);
	}

	sensor.on('data', function(){
		setUmidade(this.value);
		if(releConfig.status){
			if(umidade < releConfig.porcetRele){
				rele.high();
			}else{
				rele.low();
			}
		}
	});
	util.rodarCron();
});

function setUmidade(value){
	umidade = map(value, 180, 1023, 100, 0);
	umidade = Math.ceil(umidade);
	umidadePorc = umidade + "%"; 
	web.emit('dados', umidadePorc);
}

function map(value, fromLow, fromHigh, toLow, toHigh) {
	return (value - fromLow) * (toHigh - toLow) /
	(fromHigh - fromLow) + toLow;
}

function relay(){
	releConfig = storage.getFile('./lib/configs/rele.json', true);
	rele.query(function(state) {
		if(state.value == 1){
			rele.low();
		}
	});
}

module.exports = {
	getUmid: function(){
		return umidade;
	},
	rele: function(){
		relay();
		console.log("Rele acionado");
	}
}

var web = require('./web');
var util = require('./lib/util.js');