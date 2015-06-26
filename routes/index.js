var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' }); // cambio modulo 6 1 
});

module.exports = router;
