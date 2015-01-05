var socket = io();
var estadoRele = false;
socket.on('dados', function(dados){
	$("#planta > div").text(dados);
});

var opções = {
	showScale: true,
	datasetStroke : false,
	scaleLabel: "<%=value%>%",
	scaleBeginAtZero: true
}
socket.on('dadosGrafico', function(data){
	var lineChartData = {
		labels : [],
		datasets : [
		{
			label: "My First dataset",
			fillColor : "rgba(93,206,89,0.2)",
			strokeColor : "rgba(93,206,89,1)",
			pointColor : "rgba(158,158,158,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)",
			data : []
		}
		]

	};
	var obj = jQuery.parseJSON(data);
	for (var i = 0; i < obj.length; i++) {
		lineChartData.labels.push(obj[i].dia);
		lineChartData.datasets[0].data.push(obj[i].umidade);
	};

	var ctx = document.getElementById("canvas").getContext("2d");
	var grafico = new Chart(ctx).Line(lineChartData, opções);
	console.log(lineChartData);
});


$(document).ready(function(){
	$('#tab a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});

	$("[name='releStade']").bootstrapSwitch('state', false);
	$('input[name="releStade"]').on('switchChange.bootstrapSwitch', function(event, state) {
		$("#rele > form").slideToggle("slow");
		if(state){
			$("#formRele").submit(function(){
				var portaRele = $("#portaRele").val();
				var porcetRele = $("#porcetRele").val();

				socket.emit('releConfig', {'status': true, 'portaRele': portaRele, 'porcetRele': porcetRele});
				return false;
			});
		}else{
			socket.emit('releConfig', {'status': false});
		}
	});
});