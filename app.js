// Setup Environment 
var express = require('express'),
  morgan = require('morgan'),
  app = express(),
  routes = require('./routes/routes.js'),
  superagent = require('superagent'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session');
require('superagent-oauth')(superagent);
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;
console.log("IP address: " + ipaddress);
console.log("Port: " + port);


// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({ secret: 'socialmap',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: (3600000 * 2),
    // secure: (config.env === 'production')
  }
}));

app.use(morgan('dev'));

app.post('/checkOrAddProf/:email/:password', routes.checkOrAddProf);
  

app.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});


function ensureAuthenticated(req, res, next) {
  if (req.user) {return next();}
  res.redirect(FAIL_LOGIN_PATH);
}

