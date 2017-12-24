$(function() {

  'use strict';
  
  var msgTable = new Array();



  // init message table object
  var t =  $('#messages').DataTable( {
      data: msgTable,
      columns: [
        { data: "deveui"},
        { data: "msgtype"},
        { data: "createdAt", 
          render: function(d) {
            return moment(d).format("DD.MM.YYYY HH:mm");
            }
        },
        { data: "occupancy_s"},        
        { data: "temperature"},
        { data: "humidity"},
        { data: "app_id"},
        { data: "dev_id"}       
        ],
      order: [[ 2, "desc" ]]
    });

  // reload page after socket reconnect 
  io.socket.on('reconnect', function(event) {
    location.reload();
  })

  // listen to "message" event
  io.socket.on('message', function(entry) { 

    console.log("New message event: ", entry.data);
    
    // add to message table
    t.row.add(entry.data);
    t.draw(false);

  });

  // :/GET all messages
  io.socket.get("/message",{sort: 'updatedAt DESC'}, function (msgTable, response) {
    
    // update table
    t.clear();
    t.rows.add(msgTable);
    t.draw();    

  }); 

});
