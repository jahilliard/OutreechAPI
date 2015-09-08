var symbMod = require("../models/symbol.js");
var profMod = require('../models/profile.js');
var reechMod = require('../models/reech.js');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/outreech';

var profile = new profMod();

exports.checkOrAddProf = function(req, res){
	var tempProfile = new profMod();
	tempProfile.initializeProfile(req.params.email, req.params.password, null, function(tempProfile){
		tempProfile.findProf(pg, connectionString, tempProfile, function(wasFound, findResult){
            console.log(findResult.id);
			if (wasFound == false){
                profile.addProf(pg, connectionString,  tempProfile, 
                                            function(wasInsertProf, addedProfile){
                                                profile.initializeProfile(addedProfile.email.trim(), 
                                                                        addedProfile.password.trim(), addedProfile.id, 
                                                                            function(toRetProfClient){
                                                                                console.log("Profile added to the DB.");
                                                                                res.send(toRetProfClient);
                                                                            });
                                                                    });
            } else if (findResult.password.trim() == tempProfile.password && findResult.email.trim() == tempProfile.email){
                profile.initializeProfile(findResult.email.trim(), findResult.password.trim(), findResult.id, 
                                                    function(toRetProfClient){
                                                        console.log("Profile retrieved from the DB.");
                                                        res.send(toRetProfClient);
                                                    }
                );
            } else if (findResult.password.trim() != tempProfile.password && findResult.email.trim() == tempProfile.email) {
                console.log("Incorrect Password");
                res.send("Incorrect Password");
            } else {
                console.log("couldnt validate profile");
                res.send("couldnt validate profile");
            }
		});
	})
};
