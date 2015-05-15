$(document).ready(function(){
	var socket = io();

	socket.on('umidade real', function(dados){
		$("#planta > div").text(dados + '%');
	});

	socket.on('rele config', function(rele){
		if(rele.status){
			$("[name='releStade']").bootstrapSwitch('state', true);
			$("#portaRele").val(rele.porta);
			$("#porcetRele").val(rele.porcent);
		}else{
			$("[name='releStade']").bootstrapSwitch('state', false);
		}
	});

	socket.on('cron config', function(cron){
		$("#selectHora").val(cron.hora);
		$("#inputMinutos").val(cron.minuto);
		$("#inputMaxDados").val(cron.maxDados);
	});

	$.getJSON("/dados", function(result){
		var data = {
			labels: result[0],
			datasets: [
			{
				fillColor: "rgba(100,255,23,0.2)",
				strokeColor: "rgba(66,199,0,1)",
				pointColor: "rgba(58,173,0,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: result[1]
			}
			]
		};
		var ctx = $("#grafico").get(0).getContext("2d");
		var grafico = new Chart(ctx).Line(data);
	});

	$('#tab a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});

	$("#setDados").submit(function(){
		var hora = parseInt($("#selectHora").val());
		var minutos = parseInt($("#inputMinutos").val());
		var maxDados = parseInt($("#inputMaxDados").val());
		socket.emit('set cron', {'hora': hora, 'minuto': minutos, 'maxDados': maxDados});

		return false;
	});

	$("[name='releStade']").bootstrapSwitch('state', false);
	$('input[name="releStade"]').on('switchChange.bootstrapSwitch', function(event, state) {
		$("#rele > form").slideToggle("slow");
		if(state){
			$("#formRele").submit(function(){
				var portaRele = parseInt($("#portaRele").val());
				var porcetRele = parseInt($("#porcetRele").val());
				console.log(porcetRele);
				socket.emit('rele config', {'status': true, 'porta': portaRele, 'porcent': porcetRele});
				return false;
			});
		}else{
			socket.emit('rele config', {'status': false});
		}
	});
});