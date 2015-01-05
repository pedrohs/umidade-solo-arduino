var socket = io();
var estadoRele = false;
socket.on('dados', function(dados){
	$("#planta > div").text(dados);
});

var categories = [];
var umidade = [];

var opções = {
	showScale: true,
	datasetStroke : false,
	scaleLabel: "<%=value%>%",
	scaleBeginAtZero: true
}
socket.on('dadosGrafico', function(data){

	var obj = jQuery.parseJSON(data);
	categories = [];
		umidade = [];
	for (var i = 0; i < obj.length; i++) {
		categories.push(obj[i].dia);
		umidade.push(obj[i].umidade);
		console.log(umidade);
	};

	$(function () {
    $('#grafico').highcharts({
        title: {
            text: '',
            x: -20 //center
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Umidade (%)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '%'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Umidade',
            data: umidade
        }]
    });
});
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