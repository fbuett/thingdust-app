
/*
 * INITIALIZE TOOLTIPS
 */
$(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});


/*
 * SUBSCRIBE FUNCTIONS
 */
$(function() {

  'use strict';
  
  /*
   * Subscribe to /sensor events
   * Call returns current sensor list
   */
  io.socket.get('/sensor/subscribe', function gotResponse(body, response) {

    // load #sensors
    $('#nrOfSensors').html(body.length);  

    // build initial sensor grid view
    sensor_info_box (body);

    // build initial sensor table view 
    sensor_table_row (body);

    // listen to "sensor_event" events
    io.socket.on('sensor_event', function(entry) { 

      // get latest sensor data (sorted by updatedAt timestamp)
      io.socket.get('/sensor',{sort: 'updatedAt DESC'}, function gotResponse(body, response) {
        $('#nrOfSensors').html(body.length);
  
        // build initial sensor grid view
        sensor_info_box (body);

        // build initial sensor table view 
        sensor_table_row (body);
      }); 
    });
       
  }); 

  /*
   * Subscribe to /gateway events
   * Call returns current gateway list
   */
  io.socket.get('/gateway/subscribe', function gotResponse(body, response) {    

    // load #gateways
    $('#nrOfGateways').html(body["length"]);     

    // subscribe to /gateway events
    io.socket.on('gateway_event', function(entry) {
      
      // update gateway counter
      io.socket.get('/gateway/count', function gotResponse(body, response) {
        $('#nrOfGateways').html(body["length"]);  
      });

    });
  }); 

  /*
   * Subscribe to /message events
   * Call returns current message list
   */
  io.socket.get('/message/subscribe', function gotResponse(body, response) {  
    
    // load initial message counter
    io.socket.get('/message/count', function gotResponse(body, response) {
      $('#nrOfMessages').html(body.count);
    });

    // 
    io.socket.get('/message/getTotalUsage', function gotResponse(body, response) {
      // Get context with jQuery - using jQuery's .get() method.
      var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
      var pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: {
          labels: ["Occupied", "Visited", "Available"],
          datasets: [
            {
              data: [body["occupied"], body["visited"], body["available"]],
              backgroundColor: ["red", "orange", "green"]
            }],
        },
        options: {}
      });      
    });

    
    // subscribe to "message_event" events
    io.socket.on('message_event', function(entry) {
      
      // update message counter on message event
      io.socket.get('/message/count', function gotResponse(body, response) {
        $('#nrOfMessages').html(body.count);
      });
      
      // 
      io.socket.get('/message/getTotalUsage', function gotResponse(body, response) {
        // Get context with jQuery - using jQuery's .get() method.
        var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
        var pieChart = new Chart(pieChartCanvas, {
          type: 'pie',
          data: {
            labels: ["Occupied", "Visited", "Available"],
            datasets: [
              {
                data: [body["occupied"], body["visited"], body["available"]],
                backgroundColor: ["red", "orange", "green"]
              }],
          },
          options: {}
        });  
      });

    });

    // DONE: Messages don't get updated or removed
  }); 


  /**********************************
   * BUILD SENSOR INFORMATION GRID
   **********************************/

  function sensor_info_box (body) {

    // REQUIRES FIX: this should go into a template!
    var box = '';   

    for (var i = 0; i < body.length ; i++) { 

      box += '<div class="col-md-2 col-sm-4 col-xs-12"><div class="sensor-box">';

      // DEVEUI
      box += '<div class="sensor-box-item-full bg-aqua" data-toggle="tooltip" title="DevEUI"><div class="icon"><i class="fa fa-microchip"></i>';
      box += ' ' + body[i]["deveui"];
      box += '</div></div>';

      // Location
      box += '<div class="sensor-box-item-full bg-aqua" data-toggle="tooltip" title="Location"><div class="icon"><i class="fa fa-location-arrow"></i>';
      box += ' ' + body[i]["location"];
      box += '</div></div>';

      // Last seen
      box += '<div class="sensor-box-item-full bg-aqua" data-toggle="tooltip" title="Last Seen"><div class="icon"><i class="fa fa-clock-o"></i>';
      box += ' ' + moment(body[i]["updatedAt"]).fromNow();  
      box += '</div></div>';

      // Occupation
      if (body[i]["occupation"] == 0) {
        box += '<div class="sensor-box-item-half label-success" data-toggle="tooltip" title="Occupation">Available</div>';
      } else if ((body[i]["occupation"] > 0) && (body[i]["occupation"] <= 10))
      {
        box += '<div class="sensor-box-item-half label-warning" data-toggle="tooltip" title="Occupation">Visited</div>';
      } else if (body[i]["occupation"] > 10)
      {
        box += '<div class="sensor-box-item-half label-danger" data-toggle="tooltip" title="Occupation">Occupied</div>';
      }

      // Temperature
      box += '<div class="sensor-box-item-half bg-aqua" data-toggle="tooltip" title="Temperature"><div class="icon"><i class="fa fa-thermometer-half"></i>';
      if (typeof body[i]["temperature"] != 'undefined')
        box += ' ' + body[i]["temperature"]+'&deg;C';
      else 
        box += ' n.a.';
      box += '</div></div>';

      // Humidity
      box += '<div class="sensor-box-item-half bg-aqua" data-toggle="tooltip" title="Humidity"><div class="icon"><i class="fa fa-tint"></i>';
      if (typeof body[i]["humidity"] != 'undefined')
        box += ' ' + body[i]["humidity"] + '%';
      else 
        box += ' n.a.';      
      box += '</div></div>';

      // Ambient
      box += '<div class="sensor-box-item-half bg-aqua" data-toggle="tooltip" title="Ambient"><div class="icon"><i class="fa fa-sun-o"></i>';
      if (typeof body[i]["ambient"] != 'undefined')
         box += ' ' + body[i]["ambient"] + ' Lux';
      else 
        box += ' n.a.';
      box += '</div></div>';

      // Orientation
      box += '<div class="sensor-box-item-half bg-aqua"  data-toggle="tooltip" title="Orientation">';
      if (body[i]["orientation"] === "up")
        box += '<div class="icon"><i class="fa fa-arrow-up"></i></div>';
      else if (body[i]["orientation"] === "down")
        box += '<div class="icon"><i class="fa fa-arrow-down"></i></div>';    
      else if (body[i]["orientation"] === "lateral")
        box += '<div class="icon"><i class="fa fa-arrow-right"></i></div>'; 
      else 
        box += '-';
      box += '</div>';

      // Battery
      box += '<div class="sensor-box-item-half bg-aqua" data-toggle="tooltip" title="Battery">';
      if (body[i]["battery"] >= 3000)
        box += '<div class="icon"><i class="fa fa-battery-full"></i></div>';
      else if ((body[i]["battery"] < 3000) && (body[i]["battery" > 2500]))
        box += '<div class="icon"><i class="fa fa-battery-three-quarters"></i></div>';    
      else if ((body[i]["battery"] <= 2500) && (body[i]["battery" > 2000]))
        box += '<div class="icon"><i class="fa fa-battery-half"></i></div>'; 
      else if ((body[i]["battery"] <= 2000) && (body[i]["battery" > 1500]))
        box += '<div class="icon"><i class="fa fa-battery-quarter label-warning"></i></div>'; 
      else if (body[i]["battery"] <= 1500)
        box += '<div class="icon"><i class="fa fa-battery-empty label-danger"></i></div>';                  
      else 
        box += '-';
      box += '</div></div>';

      // Closing DIVs
      box += '</div></div>';
    }

    //append created html to the referenced element:    
    $('#sensor_grid').html(box);  
  }; 

  /**********************************
   * BUILD SENSOR INFORMATION TABLE
   **********************************/

  function sensor_table_row (body) {
    var row = '';
    
    for (var i = 0; i < body.length ; i++) { 
      
      row += '<tr>';
      row += '<td>' + body[i]["deveui"] + '</td>';
      row += '<td>' + body[i]["location"] + '</td>';
      row += '<td>' + moment(body[i]["updatedAt"]).fromNow() + '</td>';  
      row += '<td>' + body[i]["vibrations"] + '</td>';  
      
      if (body[i]["occupation"] == 0) {
        row += '<td><span class="label label-success">Available</span></td>'
      } else if ((body[i]["occupation"] > 0) && (body[i]["occupation"] <= 10))
      {
        row += '<td><span class="label label-warning">Visited</span></td>'
      } else if (body[i]["occupation"] > 10)
      {
        row += '<td><span class="label label-danger">Occupied</span></td>'
      }
      
      row += '<td>' + body[i]["temperature"] + '</td>';
      row += '<td>' + body[i]["humidity"] + '</td>';
      row += '<td>' + body[i]["ambient"] + '</td>';
      row += '<td>' + body[i]["orientation"]["x"] + ',' + body[i]["orientation"]["y"] + ',' + body[i]["orientation"]["z"]+ '</td>';
      row += '<td>' + body[i]["battery"] + '</td>';        

      // add closing </tr> tag to the string:
      row += '</tr>';           
    }
    //replace created html row in table body:
    $('#sensor_table').html(row); 
  };  

});


/*
 * CHART FUNCTIONS
 */
$(function () {

  'use strict';

  //-----------------------
  //- OCCUPATION CHART -
  //-----------------------

  // Get context with jQuery - using jQuery's .get() method.
  var salesChartCanvas = $("#salesChart").get(0).getContext("2d");
  // This will get the first returned node in the jQuery collection.
  var salesChart = new Chart(salesChartCanvas, {
    type: 'bar',
    data: {
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      datasets: [
        {
          label: "Visited",
          backgroundColor: "orange",
          data: [59, 78, 55, 88, 26, 12, 3]
        },
        {
          label: "Occupied",
          backgroundColor: "red",
          data: [159, 178, 155, 188, 126, 112, 13]
        },                    
      ]      
    },
    options: {
      //Boolean - If we should show the scale at all
      showScale: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,

      //Boolean - whether to make the chart responsive to window resizing
      responsive: true,

      scales: {
        yAxes: [{
                  stacked: true
        }],
      }
    }
  });

  //---------------------------
  //- END OCCUPATION CHART -
  //---------------------------

  //-------------
  //- PIE CHART -
  //-------------


  //-----------------
  //- END PIE CHART -
  //-----------------

});