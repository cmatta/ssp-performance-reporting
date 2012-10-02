
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , _ = require('underscore')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

mongoose.connect('mongodb://localhost/performance');


api = require('./routes/api');

app.get('/', routes.index);
app.get('/api/:report/getarrays', api.getArrays);
app.get('/api/:report/:array/getports', api.getPorts);
app.get('/api/:report/:array/:ports/getdates', api.getDates);
app.get('/api/:report/:array/:ports/gettimes', api.getDates);
app.get('/api/:report/:array/:ports/:startdate/:enddate', api.getReport);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
