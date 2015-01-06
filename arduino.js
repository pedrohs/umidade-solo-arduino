var five = require('johnny-five'),
arduino = new five.Board(),
async = require('async'),
storage = require('./lib/storage.js'),
util = require('./lib/util.js'),
web = require('./web.js'),
umidade,
releConfig = storage.getFile('./lib/configs/rele.json', true);

arduino.on("ready", function(){
	console.log("Arduino pronto");

	var sensor = new five.Sensor({
		pin: "A0",
		freq: 1000
	});

	sensor.on("data", function() {
		umidade = map(this.value, 180, 1023, 100, 0);	
		umidade = Math.ceil(umidade);
		umidadePorc = umidade + "%"; 
		web.enviaDados(umidadePorc);
		rele(umidade, false);
	});
	util.salvaDados(true);
	rele(0, true);
});

function map(value, fromLow, fromHigh, toLow, toHigh) {
	return (value - fromLow) * (toHigh - toLow) /
	(fromHigh - fromLow) + toLow;
};

var rele;
function rele(umidade, reload){
	if(reload){
		releConfig = storage.getFile('./lib/configs/rele.json', true);
		rele = new five.Pin(releConfig.portaRele);
	}
	if(releConfig.status){
		if(umidade < releConfig.porcetRele){
			rele.high();
		}else{
			rele.low();
		}
	}
}
exports.getUmidade = function(){	
	return umidade;
}
exports.reloadRele = function(){	
	releConfig = storage.getFile('./lib/configs/rele.json', true);
	console.log("rele recebido");
	console.log(releConfig);
}