var fs = require("fs");

function writeFile(file, data){
	fs.writeFileSync(file, data, 'utf8');
}
function readFile(file, parse){
	try{
		var arquivo = fs.readFileSync(file, 'utf8');
		if(parse){return JSON.parse(arquivo)}
		else{return arquivo}
	}
	catch(err){
		console.log(err);
	}
}

module.exports = {
	setFile: function(file, data){
		writeFile(file, data);
	},
	getFile: function(file, parse){
		return readFile(file, parse);
	}
}