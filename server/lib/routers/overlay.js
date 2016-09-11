var express = require('express');
var router = express.Router();
var path = require('path');

var DIST_ROOT = path.resolve(__dirname + '/../../../client');

router.get('/', function(req, res){
  res.sendFile(DIST_ROOT + '/index.html');
});


module.exports = router;
