/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  },

  afterCreate: function(entry, cb) {

  	// get DevEUI from message
  	var sensorId = entry.ttn.hardware_serial;
  	
  	// TODO: Err check

  	// get sensor data from message
  	var sensorData = entry.thingdust.data;

  	// TODO: Err check

  	// add DevEUI to sensor data
  	sensorData.deveui = sensorId;

  	// sails.log("Sensor: ", sensorData);
    
    // Update sensor data[DEVEUI] with latest message content
    Sensor.updateOrCreate({deveui:sensorId},sensorData, function afterwards(err, updated){

  	  if (err) {
  	    // handle error here- e.g. `res.serverError(err);`
  	    console.log("Sensor update error: ", err);
  	    cb();
  	  }
  	  else 
  	  	sails.log("Updated: ", updated);
    }); 

    // sails.sockets.broadcast('message', 'message_event', entry);

    cb();
  }    
};

