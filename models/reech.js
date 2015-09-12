function Reech () {
	var id;
    var hashtag;
    var atSymbol;
    var url;
    var score;
    var totalVotes;
    var latitude;
    var longitude;
}

Reech.prototype.initializeReech = function(id, hashtag, atSymbol, url, 
	score, totalVotes, latitude, longitude, callback) {
	this.id = id;
	this.hashtag = hashtag;
	this.atSymbol = atSymbol;
	this.url = url;
	this.score = score;
	this.totalVotes = totalVotes;
	this.latitude = latitude;
	this.longitude = longitude;
};

Reech.prototype.getReeches = function(pg, connectionString, callback) {
    var client = new pg.Client(connectionString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('select * from reeches;', 
        function(err, result) {
            if(err) {
              return console.error('error running query', err);
            } else {
                var findResult = result.rows;
                client.end();
                callback(findResult);
            }
        });
    });
}

Reech.prototype.associateReech = function(pg, connectionString, profId, 
                                                reechId, isOwner, callback) {
    var client = new pg.Client(connectionString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('INSERT INTO reechBelongs (profID, reechID, isOwner) VALUES ($1, $2, $3);',
                [profId, reechId, isOwner],
        function(err, result) {
            if(err) {
              return console.error('error running query', err);
            } else {
                callback({"insertCorrect" : true});
                var findResult = result.rows[0];
                client.end();
                callback({"insertCorrect" : true});
            }
        });
    });
}

Reech.prototype.addNewReech = function(pg, connectionString, profId, callback) {
    var client = new pg.Client(connectionString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('INSERT INTO reeches (url, hashtag, atsymb, score, '+
                    'totalvotes, latitude, longitude) ' +
                    'VALUES ($1, $2, $3, $4, $5, $6, $7) Returning ID;',
                [this.url, this.hashtag, this.atSymbol, this.score, this.totalVotes, 
                this.latitude, this.longitude],
        function(err, result) {
            if(err) {
              return console.error('error running query', err);
            } else {
                var findResult = result.rows[0].id;
                client.end();
                this.id = findResult
                callback(this);
            }
        });
    });
}

Reech.prototype.getAssociatedReeches = function(pg, connectionString, profId, callback) {
    var client = new pg.Client(connectionString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('select reeches.id, reeches.atSymbol, reeches.url, reeches.hashtag ' +
                        'reeches.score, reeches.totalVotes, reeches.latitude, ' +
                        'reeches.longitude from reechBelongs inner join reeches on ' +
                        'reeches.Id = reechBelongs.reechId where reechBelongs.profId = $1;',
                [profId],
        function(err, result) {
            if(err) {
              return console.error('error running query', err);
            } else {
                var findResult = result.rows[0].id;
                client.end();
                this.id = findResult
                callback(this);
            }
        });
    });
}


// runKNNToOrder = function(profId, findResult){
//     var client = new pg.Client(connectionString);
//     client.connect(function(err) {
//       if(err) {
//         return console.error('could not connect to postgres', err);
//       }
//       client.query('select reeches.atsymb, reeches.hashtag, reeches.id,
//                         from reeches inner join reechBelongs on reeches.id = reechBelongs.id
//                         where profId = $1',
//                 [profId],
//         function(err, result) {
//             if(err) {
//               return console.error('error running query', err);
//             } else {
//                 var findResult = result.rows;
//                 for (var i = findResult.length - 1; i >= 0; i--) {
//                     findResult[i]
//                 };
//                 client.end();
//                 this.id = findResult
//                 callback(this);
//             }
//         });
// }

// buildPoint = function(likedReeches){
//     var dictLikedHashtags = {};
//     for (var i = likedReeches.length - 1; i >= 0; i--) {
//     };
// }

// euclideanDistance = function(instance1, instance2, length){
//     var distance = 0;
//     for (var i = length; i >= 0; i--) {
//         distance += Math.pow((instance1[x] - instance2[x]), 2)
//     };
//     return Math.sqrt(distance);
// }

module.exports = Reech;
