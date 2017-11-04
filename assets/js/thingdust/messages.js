$(function() {

  'use strict';


  // reload page after socket reconnect 
  io.socket.on('reconnect', function(event) {
    location.reload();
  })

  // listen to "message" event
  io.socket.on('message', function(entry) { 

    message_table_row (entry.data);

  });

  // :/GET messages
  io.socket.get("/message",{sort: 'updatedAt DESC'}, function (body, response) {

    for (var i = 0; i < body.length ; i++) {        
      message_table_row(body[i]); 
    }
  
  }); 

  /* Dashboard - Real-time Updates
   * -----------------------
   * Get message data at real-time
   */  

  function message_table_row(entry) {

    // build table row
    var row = '';
    row += '<tr '+ 'id=' + entry["id"] + ' >';
    row += '<td>' + entry["deveui"].deveui + '</td>';
    row += '<td>' + entry["msgtype"] + '</td>';
    row += '<td>' + moment(entry["createdAt"]).format("dddd, MMMM Do YYYY, HH:mm:ss") + '</td>';       
    row += '<td>' + entry["occupancy_s"] + '</td>';      
    row += '<td>' + entry["temperature"] + '</td>';
    row += '<td>' + entry["humidity"] + '</td>';
    row += '<td>' + entry["app_id"] + '</td>';
    row += '<td>' + entry["dev_id"] + '</td>';        

    // add closing </tr> tag to the string:
    row += '</tr>';
    
    //append created table row to table body:
    $('#message_log').prepend(row)    
  };

});
