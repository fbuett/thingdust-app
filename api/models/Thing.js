/**
 * Thing.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    thing_name: {type: "string", required: true, unique: true},
    thing_description: {type: "string"},
    thing_type: {type: "string", enum: ['room', 'desk', 'space', 'thing'], defaultsTo: 'space'},
    
    // location data
    country: {type: "string"},
    city: {type: "string"},
    street: {type: "string"},
    number: {type: "string"},
    building: {type: "string"},
    zip: {type: "string"},
    floor: {type: "string"},
    room: {type: "string"},
    longitude: {type: "float"},
    latitude: {type: "float"},

    // associate thing with sensors
    sensors: {
      collection: 'sensor',
      via: 'thing'
    }     
  },

  // Lifecycle Callbacks
  beforeCreate: function (values, cb) {

    // name to lowercase
    var thingname = values["thing_name"].toString();
    values["thing_name"] = thingname.toLowerCase(thingname);

    cb();
  },

  // Lifecycle Callbacks
  beforeUpdate: function (values, cb) {

    // name to lowercase
    var thingname = values["thing_name"].toString();
    values["thing_name"] = thingname.toLowerCase(thingname);

    cb();
   }
     
};

