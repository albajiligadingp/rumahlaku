var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Selamat datang!' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Sign in' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/details', function(req, res, next) {
  res.render('details', { title: 'Details' });
});

module.exports = router;
