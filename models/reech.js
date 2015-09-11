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
      client.query('INSERT INTO reeches (url, hashtag, atsymb, score
                    totalvotes, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7)
                            Returning ID;',
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
}

Reech.prototype.getAssociatedReeches = function(pg, connectionString, profId, callback) {
    var client = new pg.Client(connectionString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('select reeches.id, reeches.atSymbol, reeches.url, reeches.hashtag
                        reeches.score, reeches.totalVotes, reeches.latitude, reeches.longitude
                        from reechBelongs inner join reeches on reeches.Id = reechBelongs.reechId
                        where reechBelongs.profId = $1;',
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
};

module.exports = Reech;
