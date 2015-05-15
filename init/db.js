module.exports = function(app, db){
	db.findOne({type: 'ConfigRele'}, function(err, data){
		if(data.length == 0){
			var rele = {
				config: "rele",
				status: false,
				porta: 2,
				porcent: 50
			};
			db.insert(rele, function(err, newRele){
				console.log(err);
				app.rele = newRele;
			});
		}else{
			app.rele = data;
		}
	});
}