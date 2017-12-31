$(function() {

  'use strict';

  var sensorTable = new Array();
  var tempData = new Array();
  var humData = new Array();
  var occuData = new Array();
  var timeData = new Array();

  var maxTempData;
  var minTempData;
  var maxHumData;
  var minHumData; 

  var t = $('#sensors').DataTable( {
      data: sensorTable,
      columns: [
        { data: "deveui"},
        { data: "createdAt", 
          render: function(d) {
            return moment(d).fromNow();
            }
        },
        { data: "occupancy_s"},        
        { data: "temperature"},
        { data: "humidity"}
      ],
      rowId: 'deveui',
      order: [[ 1, "desc" ]]
  });

  // reload page after socket reconnect 
  io.socket.on('reconnect', function(event) {
    location.reload();
  })

  // listen to "sensor" event
  io.socket.on('sensor', function(entry) { 
    console.log("sensor:", entry)

    // add to message table

    // tbd

  });

  // :/GET sensors
  io.socket.get("/sensor", {sort: 'updatedAt DESC'}, function (sensorTable, response) {

    // update table
    t.clear();
    t.rows.add(sensorTable);
    t.draw(); 

  }); 


  $('#sensors').on( 'click', 'td', function () {
    
    // get clicked cell
    var value = t.column( this ).dataSrc();
    // console.log("Clicked Cell:", value);

    // get table row
    var idx = t.cell(this).index();
    var deveui = t.row(idx.row).data().deveui;
    // console.log( 'DEVEUI: ', deveui );

    io.socket.get("/message?deveui="+deveui, {sort: 'updatedAt DESC'}, function (body, response) {

      
      // initiaize max and min values
      maxTempData = body[body.length - 1].temperature;
      minTempData = body[body.length - 1].temperature;
      maxHumData = body[body.length - 1].humidity;
      minHumData = body[body.length - 1].humidity;


      // build temperature data object for use in chart.js
      for (var i=1; i<body.length; i++) {
        
        // reverse timestamp order for x axis
        var j = body.length - 1 - i;
        
        tempData[i] = body[j].temperature;
        if (tempData[i] > maxTempData) maxTempData=tempData[i];
        if (tempData[i] < minTempData) minTempData=tempData[i];

        humData[i] = body[j].humidity;
        if (humData[i] > maxHumData) maxHumData=humData[i];
        if (humData[i] < minHumData) minHumData=humData[i];

        occuData[i] = body[j].occupancy_s;
        timeData[i] = moment(body[j].createdAt).format("HH:mm");
      }

      // prepare chart
      var ctx = document.getElementById("tempChart").getContext('2d');

      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: timeData,
          datasets: [{
            label: "Temperature",
            type: 'line',
            yAxisID: "T",
            data: tempData,
            borderColor: "#8e5ea2",
            fill: false
            }, {
            label: "Humidity",
            type: 'line',            
            yAxisID: "H",
            data: humData,
            borderColor: "#e8c3b9", 
            fill: false             
            }, {
            label: "Occupation",
            type: 'bar',
            yAxisID: "O",
            data: occuData,
            borderColor: "#ff0000",
            backgroundColor: "#ff0000"        
          }]
        },
        options: {
          title: {
            display: true,
            text: deveui
          },
          scales: {
            yAxes: [{
              id: 'T',
              type: 'linear',
              position: 'left',
              ticks: {
                  suggestedMin: minTempData - 2,
                  suggestedMax: maxTempData + 2,    
              }                          
            }, {
              id: 'H',
              type: 'linear',
              position: 'right',
              ticks: {
                  suggestedMin: minHumData - 2,
                  suggestedMax: minHumData + 2, 
              }, 
            }, {
              display: false,
              id: 'O',
              type: 'linear',
              ticks: {
                  suggestedMax: 350 
              }              
            }]
          }
        }

    });     
} );

});
});  
