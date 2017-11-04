
/*
 * SUBSCRIBE FUNCTIONS
 */
$(function() {

  'use strict';

  
  // reload page after socket reconnect 
  io.socket.on('reconnect', function(event) {
    location.reload();
  });


  

  // listen to "thing" event
  io.socket.on('thing', function(entry) { 

    // get latest thing data (sorted by updatedAt timestamp)
    io.socket.get('/thing/count', function gotResponse(body, response) {
      
      // update thing counter
      $('#nrOfThings').html(body.count);
 
    });
  });

  // :/GET things
  io.socket.get("/thing/count", function (body, response) {

    // load #sensors
    $('#nrOfThings').html(body.count); 
  
  }); 



  // listen to "message" event
  io.socket.on('message', function(entry) { 

    // get current message count
    io.socket.get('/message/count', function gotResponse(body, response) {
      
      // update message counter
      $('#nrOfMessages').html(body.count);

    }); 
    
    /*
    // get current sensor count
    io.socket.get('/sensor/count', function gotResponse(body, response) {
      
      // update sensor counter
      $('#nrOfSensors').html(body.count);

    });  
    */
  });

  // :/GET message
  io.socket.get("/message/count", function (body, response) {

    // update message counter
    $('#nrOfMessages').html(body.count); 
  
  });



  // listen to "sensor" event
  io.socket.on('sensor', function(entry) { 

    // get current sensor count 
    io.socket.get('/sensor/count', function gotResponse(body, response) {
      
      // update sensor counter
      $('#nrOfSensors').html(body.count);

    }); 
  });

  // :/GET sensors
  io.socket.get("/sensor/count", function (body, response) {

    // update sensor counter
    $('#nrOfSensors').html(body.count); 
  
  });

}); 

