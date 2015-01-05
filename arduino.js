var five = require('johnny-five'),
arduino = new five.Board(),
fs = require('fs'),
async = require('async'),
storage = require('./lib/storage.js'),
util = require('./lib/util.js'),
web = require('./web.js'),
umidade;

arduino.on("ready", function(){
	console.log("Arduino pronto");

	var sensor = new five.Sensor({
		pin: "A0",
		freq: 1000
	});
	var rele = new five.Pin(8);

	async.series([
		function(callback){
			sensor.on("data", function() { //Aqui ele comeÃ§a a verificar uma porta do arduino e traz um valor que Ã© tratado
				umidade = map(this.value, 180, 1023, 100, 0);	
				umidade = Math.ceil(umidade);
				util.umidade(umidade);
				if(umidade < 70){
					rele.high();
				}else{
					rele.low();
				}
				umidadePorc = umidade + "%"; //define o valor jÃ¡ tratado para uma variavel
				web.enviaDados(umidadePorc);
				callback(null);
			});
		},
		function(callback){
			util.salvaDados(true);
			callback(null);
		}
		]);
});

function map(value, fromLow, fromHigh, toLow, toHigh) {
	return (value - fromLow) * (toHigh - toLow) /
	(fromHigh - fromLow) + toLow;
};