/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
 
    deveui: {
      model: 'sensor',
    },

    // deveui: {type: 'string', required: true},
    msgtype: {type: 'string', required: true},
    temperature: {type: 'float', required: true},
    humidity: {type: 'float', required: true},
    trigger: {type: 'string', required: true},
    occupancy_s: {type: 'integer', required: true},
    unoccupancy_s: {type: 'integer', required: true},

    // TTN specific values, optional
    app_id: {type: 'string'},
    dev_id: {type: 'string'}

  },


  afterCreate: function(entry, cb) {

  	// get DevEUI from message
  	var sensorId = entry.deveui;
  	

  	// TODO: Err check

    
    // Update sensor data[DEVEUI] with latest message content
    Sensor.updateOrCreate({deveui:sensorId},entry, function afterwards(err, updated){

  	  if (err) {
  	    // handle error here- e.g. `res.serverError(err);`
  	    console.log("Sensor update error: ", err);
  	    cb();
  	  }
    }); 

    // sails.sockets.broadcast('message', 'message_event', entry);

    cb();
  }  

};

