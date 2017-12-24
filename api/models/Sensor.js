/**
 * Sensor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  // disable auto-generated primary key
  // autoPK: false,

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


  // Update or Insert function
  updateOrCreate: function(criteria, values, cb) {
    var self = this; // reference for use by callbacks
    // If no values were specified, use criteria
    if (!values) values = criteria.where ? criteria.where : criteria;

    self.findOne(criteria, function (err, result){
      if (err) 
        return cb(err, false);

      if (result){
        // sensor object (=deveui) already exists

        // update sensor object
        self.update(criteria, values, cb);
      } else {
        // create sensor object
        self.create(values, cb);
      }
    });
  } 
};

