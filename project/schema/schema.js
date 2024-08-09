var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

var userschema = new mongoose.Schema({
    usermail : { type : String, required : true,unique : true},
    password :{type: String, requied : false,default : ""},
    firstname :{type : String, requied :false,default :''},
    lastname : {type : String , required : false,default : ""},
    profileset :{type:Boolean, required : false,default : ""}
});
var user = mongoose.model("nexus_users",userschema);
module.exports = user;
