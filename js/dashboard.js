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

function consulta(){
  // Chave da API, deveria ser carregada do env, mas vou deixar desponibilizada para testes
  var api_key = "32f60b90-8e77-11ec-8d6e-295b9d9abd60";

  // Lista das moedas mais utilizadas para listar
  var currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CHF', 'CAD', 'CNY', 'ARS', 'YTL']

  // URL da API
  var url = "https://freecurrencyapi.net/api/v2/latest?apikey="+api_key+"&base_currency=BRL";

  // Lista com os valores das moedas
  var values = [];

  // Monta a requisição
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      console.log(data)
      
    }
  };

  // Envia a requisição
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}