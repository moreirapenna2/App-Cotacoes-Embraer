/* globals Chart:false, feather:false */

(function () {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })

  // Graphs
  var ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      datasets: [{
        data: [
          15339,
          21345,
          18483,
          24003,
          23489,
          24092,
          12034
        ],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })
})()

// Lista das moedas mais utilizadas para listar
var currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CHF', 'CAD', 'CNY', 'ARS', 'RUB']

// Chave da API, deveria ser carregada do env ou bd, mas vou deixar disponibilizada para testes
var api_key = "32f60b90-8e77-11ec-8d6e-295b9d9abd60";

/**
 * Consulta os valores de fechamento nos últimos 7 dias
 */
function consultaPast() {
  // Busca a data de 7 dias atrás
  var timestampPast = new Date();
  timestampPast.setDate(timestampPast.getDate() - 7);

  // Formata em YY-mm-dd
  var datePast = timestampPast.toISOString().substr(0, 10);

  // Busca a data atual
  var timestampNow = new Date();
  var dateNow = timestampNow.toISOString().substr(0, 10);

  // Define as datas que vão ter os valores
  var dates = [];

  // Itera por 7 dias
  for (var i = 0; i < 7; i++) {
    // Monta a data e subtrai os dias
    var timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - i);

    // Insere no formato YY-MM-DD
    dates.push(timestamp.toISOString().substr(0, 10));
  }

  // URL dos últimos 7 dias
  var url = "https://freecurrencyapi.net/api/v2/historical?apikey="+api_key+
    "&base_currency=BRL&date_from="+datePast+"&date_to="+dateNow

  // Busca a tabela histórica de fechamentos
  var table = document.getElementById('fechamentos');

  // Monta a requisição
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonReturn = JSON.parse(this.responseText);

      // Itera pelas datas
      for (var i = 0; i < dates.length; i++) {
        // Busca os valores na data especificada
        var dataOnDate = jsonReturn.data[dates[i]]

        // Lista com os valores das moedas
        var values = [];

        // Itera pelas moedas e adiciona na lista
        for (var j = 0; j < currencies.length; j++) {
          let valor = dataOnDate[currencies[j]]

          // Se não existir valor, coloca 0
          if (valor == undefined) {
            valor = 0;
          }

          // Busca o elemento na página
          var element = $(table).find("#"+currencies[j]);

          // Define o preço no dia do contador
          element.find("#preco-"+(i+1)).html("R$ "+valor);
        }
      }

    }
  };

  // Envia a requisição
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


/**
 * Consulta os valores no horário atual
 */
function consultaNow() {
  // URL da API
  var url = "https://freecurrencyapi.net/api/v2/latest?apikey="+api_key+"&base_currency=BRL";

  // Lista com os valores das moedas
  var values = [];

  // Busca a tabela de cotações
  var table = document.getElementById('cotacoes');

  // Monta a requisição
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonReturn = JSON.parse(this.responseText);

      // Horário da consulta
      var horario = jsonReturn.query.timestamp;

      // Formata a data
      horario = formatTime(horario);

      // Itera pelas moedas e adiciona na lista
      for (var i = 0; i < currencies.length; i++) {
        values.push(jsonReturn.data[currencies[i]])
      }

      // Itera novamente pelas moedas, buscando a entrada no front-end
      for (var i = 0; i < currencies.length; i++) {

        // Busca o elemento na página
        var element = $(table).find("#"+currencies[i]);

        // Atualiza o valor
        $(element).find('#preco').html("R$ "+values[i]);
        
        // Atualiza o horário
        $(element).find('#data').html(horario);
      }
    }
  };

  // Envia a requisição
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function formatTime(timestamp) {
  // Converte para inteiro
  timestamp = Number(timestamp);

  // Cria o objeto
  var a = new Date(timestamp * 1000);

  // Formata a data
  var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = ("0" + a.getHours()).slice(-2);
  var min = ("0" + a.getMinutes()).slice(-2);
  var sec = ("0" + a.getSeconds()).slice(-2);
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

// Ao carregar a página
$( document ).ready(function() {
  // Chama a função de consulta dos valores
  consultaNow();
  consultaPast();

  // Chama a função de atualização dos valores a cada 20 segundos
  setInterval(consultaNow, 20000);
  setInterval(consultaPast, 20000);
});