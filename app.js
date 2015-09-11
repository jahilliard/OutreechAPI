// Setup Environment 
var express = require('express'),
  morgan = require('morgan'),
  app = express(),
  routes = require('./routes/routes.js'),
  superagent = require('superagent'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  multer  = require('multer'),
  cors = require('cors');
require('superagent-oauth')(superagent);
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;
console.log("IP address: " + ipaddress);
console.log("Port: " + port);
var upload = multer({ dest: 'reechImg/' });

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.options('*', cors());


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

app.get('/getReeches/', routes.getReeches);

app.post('/likedReech/:reechId/:profId', routes.likedReech);

/*Configure the multer.*/
app.use(multer({ dest: './reechImg/',
  rename: function (fieldname, filename) {
      return filename+Date.now();
    },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done=true;
  }
  }).single("pdf")
);

app.post('/api/photo/:profId', routes.addNewReech);



app.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});


function ensureAuthenticated(req, res, next) {
  if (req.user) {return next();}
  res.redirect(FAIL_LOGIN_PATH);
}

