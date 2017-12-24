
/*
 * SUBSCRIBE FUNCTIONS
 */
$(function() {

  'use strict';

  
  // reload page after socket reconnect 
  io.socket.on('reconnect', function(event) {
    location.reload();
  })

  // listen to "thing" event
  io.socket.on('thing', function(entry) { 

    // get latest thing data (sorted by updatedAt timestamp)
    io.socket.get('/thing',{sort: 'updatedAt DESC'}, function gotResponse(body, response) {

      if (body.length > 0) {
        // build initial sensor grid view
        thing_table_row (body);

        // show things table
        $('#things_created_box').removeClass('hidden');     
      }
      else {
        // show "Create things" button only
        $('#no_things_created_box').toggleClass('hidden'); 
      }

    }); 
  });

  // :/GET things
  io.socket.get("/thing", function (body, response) {


    if (body.length > 0) {
      // build initial sensor grid view
      thing_table_row (body);

      // show things table
      $('#things_created_box').removeClass('hidden');     
    }
    else {
      // show "Create things" button only
      $('#no_things_created_box').toggleClass('hidden'); 
    }
  
  }); 


  /**********************************
   * BUILD THING INFORMATION TABLE
   **********************************/

  function thing_table_row (body) {
    console.log(body)
    var row = '';
    
    for (var i = 0; i < body.length ; i++) { 
      
      row += '<tr>';
      row += '<td>' + body[i]["thing_name"] + '</td>';
      row += '<td>' + body[i]["thing_description"] + '</td>';
      row += '<td>' + body[i]["thing_type"] + '</td>';      
      row += '<td>' + body[i]["location"] + '</td>';
      
      if (body[i]["sensors"].length > 0 )        
        row += '<td>' + body[i]["sensors"] + '</td>';
      else
        row += '<td>' + 'not assigned' + '</td>';
      row += '<td>' + moment(body[i]["updatedAt"]).fromNow() + '</td>';       

      // add closing </tr> tag to the string:
      row += '</tr>';           
    }
    //replace created html row in table body:
    $('#thing_table').html(row); 
  };


  $('#thing-create-form').submit(function(event) {
    // event.preventDefault();
    
    /***********************************
    /*  AJAX Implementation

    var postData = $(this).serializeArray()
    console.log(postData)    
    $.ajax({
      url: "http://localhost:1337/api/thing",
      type: "POST",
      data: postData,
          success: function(data){
               console.log(data)
               $('#myModal').modal('hide');
               // location.reload();
      },
      error: function(error) {
        console.log(error);
      }
    })
    */

    /****************************/
    /* Socket.io implementation
    /****************************/

    
    // serialize and convert form data
    var data = {};
    $(this).serializeArray().map(function(x){data[x.name] = x.value;});

    // send to socket.io
    io.socket.post("/thing", data, function (resData, jwres) {
      if (jwres.error) {
        console.log(jwres.error);

        // TODO: show errors in modal
      }
      else
        // close modal
        $('#myModal').modal('hide');
    });

  });

}); 

