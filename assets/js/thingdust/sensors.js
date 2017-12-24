$(function() {

  'use strict';

  var sensorTable = new Array();
  var tempData = new Array();
  var humData = new Array();
  var occuData = new Array();
  var timeData = new Array();

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
    t.row.add(entry.data);
    t.draw(false);
    
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

    io.socket.get("/message?deveui="+deveui, {sort: 'updatedAt ASC'}, function (body, response) {

      // build temperature data object for use in chart.js
      for (var i=0; i<body.length; i++) {
        tempData[i] = body[i].temperature;
        humData[i] = body[i].humidity;
        occuData[i] = body[i].occupancy_s;
        timeData[i] = moment(body[i].createdAt).format("HH:mm");
      }

      // prepare chart
      var ctx = document.getElementById("tempChart").getContext('2d');

      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timeData,
          datasets: [{
            label: "Temperature",
            yAxisID: "T",
            data: tempData
            }, {
            label: "Humidity",
            yAxisID: "H",
            data: humData
          }]
        },
        options: {
          scales: {
            yAxes: [{
              id: 'T',
              type: 'linear',
              position: 'left'              
            }, {
              id: 'H',
              type: 'linear',
              position: 'right'
            }]
          }
        }

    });     
} );

});
});  
