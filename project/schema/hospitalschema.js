var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

var userschema = new mongoose.Schema({

    'Name of Hospital': { type: String },
    State: { type: String }
   
});
var hosp = mongoose.model("hospital",userschema);
module.exports = hosp;