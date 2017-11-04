$(function() {

  'use strict';


  // reload page after socket reconnect 
  io.socket.on('reconnect', function(event) {
    location.reload();
  })

  // listen to "sensor" event
  io.socket.on('sensor', function(entry) { 

    console.log("sensor:", entry)
    sensor_table_row (entry.data);

  });

  // :/GET sensors
  io.socket.get("/sensor", {sort: 'updatedAt DESC'}, function (body, response) {

    for (var i = 0; i < body.length ; i++) {        
      sensor_table_row(body[i]); 
    }
  
  }); 

  function sensor_table_row(entry) {
    console.log(entry)
    // build table row
    var row = '';
    row += '<tr '+ 'id=' + entry["id"] + ' >';
    row += '<td>' + entry["deveui"] + '</td>';
    row += '<td>' + moment(entry["updatedAt"]).fromNow() + '</td>';       
    row += '<td>' + entry["occupation"] + '</td>';      
    row += '<td>' + entry["temperature"] + '</td>';
    row += '<td>' + entry["humidity"] + '</td>'; 
    row += '<td>' + 'TTN' + '</td>';  

    if  (entry.hasOwnProperty('thing'))         
        row += '<td>' + '<a href="#">' + entry["thing"].thing_name + '</a>' + '</td>';
    else
        row += '<td>' + 'not assigned' + '</td>';
    row += '<td>' + '<a href="#">Messages</a>' + '</td>'; 

    // add closing </tr> tag to the string:
    row += '</tr>';
    
    //append created table row to table body:
    $('#sensor_inventory').append(row)    
  };

});
