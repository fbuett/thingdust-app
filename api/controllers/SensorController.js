/**
 * SensorController
 *
 * @description :: Server-side logic for managing sensors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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