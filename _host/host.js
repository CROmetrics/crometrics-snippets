module.exports = function(directory){
  const fs = require('fs');
  const express = require('express');
  const app = express();

  const ssl_credentials = {
    key: fs.readFileSync(__dirname + "/ssl/server.key", 'utf8'),
    cert: fs.readFileSync(__dirname + "/ssl/server.crt", 'utf8')
  };

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
      return res.send(200);
    } else {
      return next();
    }
  });

  app.set('port', (process.env.PORT || 8123));

  app.use(express.static(directory));

  require('https').createServer(ssl_credentials, app).listen(app.get('port'), function () {
    console.log('https://local.host:' + app.get('port') + '/');
  }).on('error', function(e){
    console.error('ERROR', e);
  });
};