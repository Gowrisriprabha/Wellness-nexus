var express = require('express');
const passport = require('passport');
var localstrategy = require('passport-local').Strategy;
var googlestrategy = require('passport-google-oauth20').Strategy;
var HospitalRoute  = express.Router();
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb'); 
var hosp = require("../schema/hospitalschema.js");
var user = require("../schema/schema.js");
const { toNamespacedPath } = require('path');
const {hello} =  require("../Mongodbconnection/mongodDriver.js");
const diatest = require("../paths/arraylist.js");
let hospcollec,appointmentcollec;

async function setupCollections() {
    try {
        let  { hospcoll, appointmentcoll } = await hello();
        hospcollec = hospcoll;
        appointmentcollec = appointmentcoll;
        console.log('Collections initialized');
       
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

setupCollections();



var count = 0;


function checkauth(req,res,next){
    if(req.isAuthenticated())
    next();
else{

    res.redirect("/signin");
}

}

HospitalRoute.use(function(req,res,next){
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash("info");
    next();

});

async function alreadysign(req,res,next){
    if(req.isAuthenticated())
    {      console.log("hello there");
        var id = req.session.passport.user.id;
        console.log(id);
         var hos = await hospcollec.findOne({_id:new ObjectId(id)});
         var userclin = await user.findOne({_id:id});
         console.log(hos,userclin);
         if(hos){
            res.redirect("/hosdashboard")
         }
         else if(userclin){
            res.redirect("/dashboard")
         }
            }
    
else{
    next();
}
}

function checkprof(req,res,next){
    console.log("starting check prof");
    
  
    console.log("after check prod ");

    var bool = user.findOne({_id:req.user.id});

    console.log("hey i amn bool",bool.profileset);
    if(!bool.profileset)
    next();
else
res.redirect("/dashboard");
}


function isDateAhead(inputDateStr) {
 
    const [day, month, year] = inputDateStr.split('/').map(Number);
    
   
    const inputDate = new Date(year, month - 1, day); 
    const currentDate = new Date();
    
  
    if (inputDate > currentDate) {
        return 1; 
    } else {
        return 0; 
    }
}

function getCurrentTime() {

    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();

    
    const formattedHours = (hours < 10 ? '0' : '') + hours;
    const formattedMinutes = (minutes < 10 ? '0' : '') + minutes;

    const currentTime = `${formattedHours}:${formattedMinutes}`;

    return currentTime;
}

HospitalRoute.get("/hosdashboard",function(req,res){
    res.render("hosdashboard.ejs")
})

HospitalRoute.get("/specialists",function(req,res){
    res.render("specialists.ejs")
})

HospitalRoute.get("/hosappointment",function(req,res){
    res.render("hosappointment.ejs")
})

HospitalRoute.get("/notifications",function(req,res){
    res.render("notifications.ejs")
})

HospitalRoute.get("/settings",function(req,res){
    res.render("settings.ejs")
})

HospitalRoute.get("/hostodayapp",function(req,res){
    res.render("hostodayapp.ejs")
})

function isDateAhead(inputDateStr) {
   
    const [day, month, year] = inputDateStr.split('/').map(Number);
    
 
    const inputDate = new Date(year, month - 1, day); 
    const currentDate = new Date();

    if (inputDate > currentDate) {
        return 1; 
    } else {
        return 0; 
    }
}

HospitalRoute.get("/hoscancelapplist",async function(req,res){
    var id = req.query.id;
    var reason = req.query.reason;
    var cancelledtime = getCurrentTime();
    var filter = {
        _id: new ObjectId(id)
    };
    var cancelleddate = getdate();
    const update = { $set: { appointmentcancel: 1 ,reason:reason,cancelleddate:cancelleddate,cancelledby:'hospital',cancelledtime:cancelledtime} };
    await appointmentcollec.updateOne(filter,update)
    res.status(200).send('Success!');

})

HospitalRoute.get("/hosmarkasdone",async function(req,res){
    var id = req.query.id;
    var completedtime = getCurrentTime();
    var filter = {
        _id: new ObjectId(id)
    };
    var completeddate = getdate();
    const update = { $set: { appointmentdone: 1 ,completeddate:completeddate,completedtime:completedtime} };
    await appointmentcollec.updateOne(filter,update)
    res.status(200).send('Success!');


})

HospitalRoute.post("/adddoctorhos",async function(req,res){
    console.log(req.body,"hey there hello man ");
    var name = req.body.name;
    var gender = req.body.sex;
    var mail = req.body.mail;
    var number = req.body.phone;
    var spec = req.body.country;
    var city = req.body.city;
    var id = req.session.passport.user.id;
 var filter = {
    _id: new ObjectId(id)

}
var update =   { doctorname:name ,gender:gender,email:mail,spec:spec,phone:number,city:city} ;
await hospcollec.updateOne(filter,{ $push: { doctordetails: update } });
    
    res.status(200).send('Success!');

})

HospitalRoute.get("/hosupcomingapp",async function(req,res){
    var id = req.session.passport.user.id;
 var filter = {
    hosid:id
        }
var lisdata = await appointmentcollec.find(filter).toArray();

    res.send(lisdata);




})

HospitalRoute.get("/hospdata2",async function(req,res){
    var id = req.session.passport.user.id;
    var filter = {
        hosid: new ObjectId(id)
    
    }
    var list =  await appointmentcollec.find(filter).toArray();
    res.send(list);


})

HospitalRoute.get("/hospdata",async function(req,res){
    console.log(req.session.passport,"this is hospdata remberc");
 var id = req.session.passport.user.id;
 var filter = {
    _id: new ObjectId(id)

}
console.log(filter);
    var person = await hospcollec.find(filter).toArray();

    res.send(person);
})



module.exports = HospitalRoute;
