var fs = require('fs');

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
function writeFile(dir, value){
	fs.writeFileSync(dir, value, 'utf8');
}

module.exports = {
	getFile: function(file, parse){
		return readFile(file, parse);
	},
	setFile: function(dir, value){
		writeFile(dir, value);
	}
}