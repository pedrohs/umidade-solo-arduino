var five = require('johnny-five'),
arduino = new five.Board(),
async =		require('async'),
storage =	require('./lib/storage'),
web =		require('./web'),
util =		require('./lib/util'),
umidade,
releConfig = storage.getFile('./lib/configs/rele.json', true),
rele;
arduino.on("ready", function(){
	console.log("Arduino pronto");

	var sensor = new five.Sensor({
		pin: "A0",
		freq: 1000
	});

	if(releConfig.status){
		rele = new five.Pin(releConfig.portaRele);
	}

	sensor.on("data", function() {
		umidade = map(this.value, 180, 1023, 100, 0);	
		umidade = Math.ceil(umidade);
		umidadePorc = umidade + "%"; 
		web.enviaDados(umidadePorc);
		if(releConfig.status){
			if(umidade < releConfig.porcetRele){
				rele.high();
			}else{
				rele.low();
			}
		}
	});
	util.salvaDados();
});

function map(value, fromLow, fromHigh, toLow, toHigh) {
	return (value - fromLow) * (toHigh - toLow) /
	(fromHigh - fromLow) + toLow;
};

exports.getUmidade = function(){	
	return umidade;
}
exports.reloadRele = function(){	
	releConfig = storage.getFile('./lib/configs/rele.json', true);
	if(releConfig.status){
		rele = new five.Pin(releConfig.portaRele);
	}
	rele.query(function(state) {
		if(state.value == 1){
			rele.low();
		}
	});
}