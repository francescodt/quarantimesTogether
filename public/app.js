'use strict';

console.log('app.js is running');
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
      return entry.date;
    })
    let dataCases = data.map(entry => {
     return entry.confirmed;
    })
    console.log(dataLabels);
    console.log(dataCases);
    makeChart(dataLabels, dataCases);
  });
  //event listener
  $('select').change(hideElement);
//   let $section = $('<section>').attr('data-keyword', story.category);
  
  //hidey filter gafiltafish
   function hideElement() { 
   let value = $(this).val(); 
   console.log(value);
    {  
     $('section').hide();    
     $(`section.${value}`).slideDown(888); 
     }                                       
  }
  $('#clearFilter').on('click', ()=>{
      console.log('filters cleared');
    $('section').slideDown(888); 
  })