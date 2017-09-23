var mqtt = require('mqtt');

module.exports = function mqttHook (sails) {

	var client  = mqtt.connect('mqtt://ttn-gateway.local', {username:"openhab", password:"openhab"});
	    
	return {
			
		initialize: function (done) {
			client.on('connect', function () {
				sails.log("connected");
				client.subscribe('thingdust');
			});	
			client.on('message', function (topic, message) {
				sails.log(message.toString());
				sails.models.message.create(JSON.parse(message)).exec(function (err, finn){
  					if (err) { return err; }
  					sails.log('Message ID is:', finn.id);
  					return;
				});
			});	
			return done();
		}
	};
};