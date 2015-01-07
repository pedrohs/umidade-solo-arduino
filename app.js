var five = require('johnny-five');
var arduino = new five.Board();
var util = require('./lib/util');
var storage = require('./lib/storage');
var web = require('./web');
var umidade;
var releTime;

arduino.on('ready', function(){
	console.log("Arduino Pronto");

	var sensor = new five.Sensor({
		pin: "A0",
		freq: 250
	});

	sensor.on('data', function(){
		setUmidade(this.value);
	});
	rele();
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

function rele(){
	var releConfig = storage.getFile('./lib/configs/rele.json', true);
	var rele;
	if(releConfig.status){
		rele = new five.Pin(releConfig.portaRele);
		releTime = setInterval(function(){
			if(umidade < releConfig.porcetRele){
				rele.high();
			}else{
				rele.low();
			}
		}, 1000);
	}
}

module.exports = {
	getUmid: function(){
		return umidade;
	},
	rele: function(){
		rele();
	}
}