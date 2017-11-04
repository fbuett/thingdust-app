'use strict'

var mqtt = require('mqtt')

module.exports = function mqttHook (sails) {

	var client  = mqtt.connect('mqtt://ttn-gateway.local', {username:"openhab", password:"openhab"});
	    
	return {
			
		initialize: function (done) {
			
			client.on('connect', function () {
				sails.log("MQTT connected");
				client.subscribe('thingdust');
			});	
			
			client.on('reconnect', function (){
				// sails.log("MQTT reconnected");
			});
			
			client.on('message', function (topic, message) {
				sails.log(message.toString());
				sails.models.message.create(JSON.parse(message)).exec(function (err, finn){
  					if (err) { 
  						sails.log.error("MQTT: ", err)
  						return err; 
  					}
  					sails.log('Message ID is:', finn.id);
  					return;
				});
			});

			client.on('close', function(){
				// sails.log("MQTT close");
			});
			client.on('offline', function(){
				sails.log("MQTT offline");
			});
			client.on('error', function(){
				sails.log("MQTT error");
			});	

			return done();
		}
	};
};