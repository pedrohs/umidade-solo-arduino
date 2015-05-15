module.exports = function(app, db){
	var moment = require('moment');
	var CronJob = require('cron').CronJob;
	var async = require('async');

	app.cronJob = function(){
		var cron;
		async.series([
			function(callback){
				db.findOne({type: "cron"}, function(err, dados){
					if(err){return console.log(err);}
					cron = dados;
					callback(null);
				});
			},
			function(callback){
				var job = new CronJob('00 '+ cron.minuto +' '+ cron.hora +' * * 1-6', function(){
					db.find({type: 'dados'}).sort({ dia: 1 }).exec(function(err, data){
						if(data.length < cron.maxDados){
							var newDado = {
								type: "dados",
								dia: moment().format('DD/MM'),
								porcent: app.valor
							};
							db.insert(newDado, function(err, newdado){
								if(err){return console.log(err);}
								console.log("inserido");
							});
						}else{
							var last = data.length - 1;
							console.log(last);
							db.remove({_id: data[last]._id}, function(err){
								if(err){return console.log(err);}
								console.log("Removido");
								var newDado = {
									type: "dados",
									dia: moment().format('DD/MM'),
									porcent: app.valor
								};
								db.insert(newDado, function(err, newdado){
									if(err){return console.log(err);}
									console.log("inserido");
								});
							});
						}
					});
				},true, "Brazil/Brasilia");
				callback(null);
			}
			]);
	};

	function dbInsertDados(){
		var newDado = {
			type: "dados",
			dia: moment().format('DD/MM'),
			porcent: app.valor
		};
		db.insert(newDado, function(err, newdado){
			if(err){return console.log(err);}
			console.log("inserido");
		});
	};
}