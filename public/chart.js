'use strict';
console.log('chart.js is running');
const query = $('#query').serialize();
const ajaxSettings = {
  method: 'get',
  data: query,
  dataType: 'json'
};
console.log('about to AJAX', ajaxSettings);
$.ajax('/chart.json', ajaxSettings)
  .then(function (data) {
    console.log(data);
    let dataLabels = data.map(entry => {
      return entry.label;
    })
    let dataCases = data.map(entry => {
     return entry.data;
    })
    console.log(dataLabels);
    console.log(dataCases);
    makeChart(dataLabels, dataCases);
  });

function makeChart(dataLabels, dataCases) {
new Chart(document.getElementById("line-chart"), {
    type: 'line',
    data: {
      labels: dataLabels,
      datasets: [{ 
          data: dataCases,
          label: "Country",
          borderColor: "#3e95cd",
          fill: false,
          backgroundColor: "rgba(0, 0, 0, 1)",
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'confirmed cases'
      }
    }
  });

}