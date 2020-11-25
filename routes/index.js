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
    if (req.body.password != req.body.repassword) {
      req.flash('info', "Pasword doesn't match!");
      return res.redirect('/register');
    }

    pool.query('SELECT * FROM public.user WHERE email = $1', [req.body.email], (err, data) => {
      if (err) {
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
            req.flash('info', "Fail to register your account!");
            return res.redirect('/register');
          }
          req.flash('info', "Yeay, you have registered! Please sign in :)");
          res.redirect('/signin');
        })
      });
    })
  });

  // profil
  router.get('/profil', function (req, res, next) {
    pool.query('SELECT * FROM public.user WHERE iduser = $1', [req.session.user.iduser], (err, data) => {
      if (err) throw err;

      res.render('profil', { title: 'Profil', user: req.session.user, data: data.rows[0], info: req.flash('info') });
    });
  });

  router.post('/profil', function (req, res, next) {
    pool.query('UPDATE public.user SET nama = $1, email = $2, nohandphone = $3 WHERE iduser = $4', [req.body.nama, req.body.email, req.body.nohandphone, req.session.user.iduser], err => {
      if (err) throw err;

      req.flash('info', "Yeay, your profile has been updated!");
      res.redirect('/profil');
    });
  });

  router.delete('/profil', function (req, res, next) {
    pool.query('DELETE FROM public.user WHERE iduser = $1', [req.session.user.iduser], (err) => {
      if (err) throw err;

      req.flash('info', "Your profile has been deleted!");
      res.redirect('/profil');
    });
  });

  // reset password
  router.get('/pass', function (req, res, next) {
    res.render('pass', { title: 'Reset password', info: req.flash('info')});
  });

  router.post('/pass', function (req, res, next) {
    if (req.body.newpassword != req.body.renewpassword) {
      req.flash('info', "New Pasword doesn't match!");
      return res.redirect('/pass');
    }

    bcrypt.hash(req.body.newpassword, saltRounds, function (err, hash) {
      if (err) {
        req.flash('info', "Fail to encrypt password");
        return res.redirect('/pass');
      }
      pool.query('UPDATE public.user SET password = $1 WHERE iduser = $2', [hash, req.session.user.iduser], err => {
        if (err) throw err;

        req.flash('info', "Yeay, your password has been reset!");
        res.redirect('/pass');
      });
    });
  });

  // ads
  router.get('/ads', function (req, res, next) {
    res.render('ads', { title: 'My Advertisement', user: req.session.user, info: req.flash('info') });
  });

  router.post('/ads', function (req, res, next) {
    pool.query('INSERT INTO public.iklan (judul, tipe, luastanah, luasbangunan, kamartidur, kamarmandi, lantai, fasilitas, carport, sertifikasi, harga, alamat, deskripsi, gambar, penjual, nohppenjual) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [req.body.judul, req.body.tipe, req.body.luastanah, req.body.luasbangunan, req.body.kamartidur, req.body.kamarmandi, req.body.lantai, req.body.fasilitas, req.body.carport, req.body.sertifikasi, req.body.harga, req.body.alamat, req.body.deskripsi, req.body.gambar, req.body.penjual, req.body.nohppenjual], err => {
      if (err) throw err;

      req.flash('info', "Yeay, your ads has been added!");
      res.redirect('/ads');
    });
  });

  // list ads
  router.get('/listads', function (req, res, next) {
    pool.query('SELECT * FROM public.iklan WHERE penjual = $1', [req.session.user.nama], (err, data) => {
      if (err) throw err;

      res.render('listads', { title: 'List Ads', data: data.rows, info: req.flash('info'), user: req.session.user });
    });
  });

  router.post('/listads', function (req, res, next) {
    pool.query('UPDATE public.user SET nama = $1, email = $2, nohandphone = $3 WHERE iduser = $4', [req.body.nama, req.body.email, req.body.nohandphone, req.session.user.iduser], err => {
      if (err) throw err;

      req.flash('info', "Yeay, your ads has been edited!");
      res.redirect('/listads');
    });
  });

  // details
  router.get('/details', function (req, res, next) {
    res.render('details', { title: 'Details' });
  });

  return router;
}
