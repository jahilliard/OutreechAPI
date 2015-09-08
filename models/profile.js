function Profile() {
    var email;
    var password;
    var ID;
}

Profile.prototype.initializeProfile = function(email, password, ID, callback) {
    this.email = email;
    this.password = password;
    this.id = ID;
    callback(this);
};

Profile.prototype.findProf = function(pg, connectionString, tempProf , callback) {
    var client = new pg.Client(connectionString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('select ID, email, password from profiles where email = $1;', [tempProf.email],
        function(err, result) {
            if(err) {
              return console.error('error running query', err);
            } else {
                var findResult = result.rows[0];
                client.end();
                if (findResult != null){
                    callback(true, findResult);
                } else {
                    callback(false, findResult);
                }
                
            }
        });
    });
}

Profile.prototype.addProf = function(pg, connectionString, tempProf, callback) {
    var client = new pg.Client(connectionString);
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      client.query('INSERT INTO profiles (email, password) VALUES ($1, $2) RETURNING ID, email, password;', 
                    [tempProf.email, tempProf.password],
        function(err, result) {
            if(err) {
              return console.error('error running query', err);
            } else {
                var findResult = result.rows[0];
                client.end();
                if (findResult != null){
                    callback(true, findResult);
                } else {
                    callback(false, findResult);
                }
                
            }
        });
    });
}

module.exports = Profile;
