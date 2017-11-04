/**
 * Sensor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  // disable auto-generated primary key
  autoPK: false,

  attributes: {
    
    // set deveui as primary key
    deveui: {
      type: 'string',
      primaryKey: true,
      required: true
    },

    description: {type: "string"},
  	occupation: {type: "integer"},
  	temperature: {type: "float"},
  	humidity: {type: "float"},
    
    // associate sensor with messages

    messages: {
      collection: 'message',
      via: 'deveui'
    },

    // link sensor to a thing
    thing: {
      model: 'thing'
    }    
  },

 
};

