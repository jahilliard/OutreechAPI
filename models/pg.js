// TEST DATABASE CODE

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    console.log("sdfgsdf");
    if(err) {
      return console.error('error running query', err);
    }
    client.query('SELECT NOW() AS "theTime"', function(err, result1) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log("sdfgsdf Sample query: NEW " + result1.rows[0].theTime);
    
    client.end();
  });
    console.log("asdfasd Sample query: " + result.rows[0].theTime);
    client.end();
    });
});