$(function() {

  'use strict';

  /* Messages - Initial Load 
   * -----------------------
   * Get all message data
   */

  io.socket.get('/sensor', function (body, response) {
    
    // declare html variable (a string holder):
    var table = '';
    for (var i = 0; i < body.length ; i++) {        
      message_table_row(body[i]);
    }
  });  

  /* Dashboard - Real-time Updates
   * -----------------------
   * Get message data at real-time
   */  

  io.socket.get('/sensor/subscribe', function gotResponse(body, response) {
    io.socket.on('new_sensor', function (entry) {
        message_table_row(entry);
    });
  }); 

  function message_table_row(entry) {
    // build table row
    var row = '';
    row += '<tr '+ 'id=' + entry["id"] + ' >';
    row += '<td>' + entry["deveui"] + '</td>';
    row += '<td>' + moment(entry["updatedAt"]).fromNow() + '</td>';       
    row += '<td>' + entry["occupation"] + '</td>';      
    row += '<td>' + entry["temperature"] + '</td>';
    row += '<td>' + entry["humidity"] + '</td>';
    row += '<td>' + entry["ambient"] + '</td>';
    row += '<td>' + entry["orientation"] + '</td>';
    row += '<td>' + entry["battery"] + '</td>';        

    // add closing </tr> tag to the string:
    row += '</tr>';
    
    //append created table row to table body:
    $('#sensor_inventory').append(row)    
  };

});
