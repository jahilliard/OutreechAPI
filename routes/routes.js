var symbMod = require("../models/symbol.js");
var profMod = require('../models/profile.js');
var reechMod = require('../models/reech.js');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/outreech';



exports.checkOrAddProf = function(req, res){
    var profile = new profMod();
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
                                                                                res.json(toRetProfClient);
                                                                            });
                                                                    });
            } else if (findResult.password.trim() == tempProfile.password && findResult.email.trim() == tempProfile.email){
                profile.initializeProfile(findResult.email.trim(), findResult.password.trim(), findResult.id, 
                                                    function(toRetProfClient){
                                                        console.log("Profile retrieved from the DB.");
                                                        res.json(toRetProfClient);
                                                    }
                );
            } else if (findResult.password.trim() != tempProfile.password && findResult.email.trim() == tempProfile.email) {
                console.log("Incorrect Password");
                res.json({"err" :"Incorrect Password"});
            } else {
                console.log("couldnt validate profile");
                res.json({"err" :"couldnt validate profile"});
            }
		});
	})
};

exports.getReeches = function(req, res){
    var reech = new reechMod();
    reech.getReeches(pg, connectionString, function(retFindRows){
        res.send(retFindRows);
    });
}

exports.likedReech = function(req, res){
    var reech = new reechMod();
    reech.associateReech(pg, connectionString, 
        req.params.profId, req.params.reechId, false, function(didInsertCorrectly){
        res.json(didInsertCorrectly);
    });
}

exports.addNewReech = function(req, res){
    var reech = new reechMod();
    reech.initializeReech(null, req.query.hashtag, req.query.atSymbol,
            req.file.path, 1, 1, req.query.latitude, req.query.latitude, 
            function(reech){
                reech.addNewReech(pg, connectionString, req.params.profId,
                    function(reech){
                        reech.associateReech(pg, connectionString, req.params.profId,
                            reech.id, true, function(didInsertCorrectly){
                                res.json(didInsertCorrectly);
                            })
                    });
            })
}



