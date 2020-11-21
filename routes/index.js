const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

// middleware login
const isLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/signin');
  }
}

module.exports = function (pool) {
  // home page
  router.get('/', isLoggedIn, function (req, res, next) {
    res.render('index', { title: 'Welcome!', user: req.session.user });
  });

  // sign in
  router.get('/signin', function (req, res, next) {
    res.render('signin', { info: req.flash('info') });
  });

  router.post('/signin', function (req, res, next) {
    pool.query('SELECT * FROM public.user WHERE email = $1', [req.body.email], (err, data) => {
      if (err) {
        console.log(req.body.email);
        req.flash('info', "Try again later!");
        return res.redirect('/signin');
      }

      if (data.rows.length == 0) {
        req.flash('info', "Email doesn't exist!");
        return res.redirect('/signin');
      }

      bcrypt.compare(req.body.password, data.rows[0].password, function (err, result) {
        if (err) {
          req.flash('info', "Username or password doesn't exist!");
          return res.redirect('/signin');
        }

        if (result) {
          let user = data.rows[0];
          delete user['password'];
          req.session.user = user;
          res.redirect('/');
        } else {
          console.log('cek user gagal');
          console.log(req.body.email);
          console.log(req.body.password);
          req.flash('info', "Username or password doesn't exist!");
          return res.redirect('/signin');
        }
      });
    });
  });

  // sign out
  router.get('/signout', function (req, res, next) {
    req.session.destroy(function (err) {
      res.redirect('/signin');
    })
  });

  // register
  router.get('/register', function (req, res, next) {
    res.render('register', { info: req.flash('info') });
  });

  router.post('/register', function (req, res, next) {
    console.log(req.body);
    if (req.body.password != req.body.repassword) {
      req.flash('info', "Pasword doesn't match!");
      return res.redirect('/register');
    }

    pool.query('SELECT * FROM public.user WHERE email = $1', [req.body.email], (err, data) => {
      if (err) {
        console.log(req.body.email);
        req.flash('info', "Fail to check user!");
        return res.redirect('/register');
      }

      if (data.rows.length > 0) {
        req.flash('info', "Email is exist!");
        return res.redirect('/register');
      }

      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
          req.flash('info', "Fail to encrypt password");
          return res.redirect('/register');
        }
        pool.query('INSERT INTO public.user (nama, email, password, nohandphone) VALUES ($1, $2, $3, $4)', [req.body.nama, req.body.email, hash, req.body.nohandphone], (err, data) => {
          if (err) {
            console.log('insert into gagal');
            console.log(req.body.nama);
            console.log(req.body.email);
            console.log(hash);
            console.log(req.body.nohandphone);
            req.flash('info', "Fail to register your account!");
            return res.redirect('/register');
          }
          req.flash('info', "Yeay, you have registered! Please sign in :)");
          res.redirect('/signin');
        })
      });
    })
  });

  // details
  router.get('/details', function (req, res, next) {
    res.render('details', { title: 'Details' });
  });

  return router;
}
