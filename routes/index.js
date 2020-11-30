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
    const kategoriFiltered = req.query.kategori;
    const provinsiFiltered = req.query.provinsi;
    const kotaFiltered = req.query.kota;
    const hargaFiltered = req.query.harga;

    let filter = [];
    let field = [];

    if (kategoriFiltered) {
      filter.push(kategoriFiltered);
      field.push('kategori');
    }

    if (provinsiFiltered) {
      filter.push(provinsiFiltered);
      field.push('provinsi');
    }

    if (kotaFiltered) {
      filter.push(kotaFiltered);
      field.push('kota');
    }

    if (hargaFiltered) {
      filter.push(hargaFiltered);
      field.push('harga');
    }

    console.log(req.query.kategori)
    console.log(field)

    let sql = `SELECT count(*) FROM public.iklan`;

    if (filter.length > 0) {
      sql += ` WHERE`;
      for (let i = 0; i < field.length; i++) {
        switch (field[i]) {
          case 'kategori':
            sql += ` ${field[i]} = ${filter[i]}`;
            break;
          case 'provinsi':
            sql += ` ${field[i]} = ${filter[i]}`;
            break;
          case 'kota':
            sql += ` ${field[i]} = ${filter[i]}`;
            break;
          case 'harga':
            sql += ` ${field[i]} = ${filter[i]}`;
            break;
        }
        if (i !== field.length - 1) sql += ` AND`;
      }
    }

    const page = Number(req.query.page) || 1;
    const perPage = 6;
    const queries = req.query;

    pool.query(sql, (err, count) => {
      if (err) console.log(err);
      const total = count.rows[0].count;
      const pages = Math.ceil(total / perPage);
      const offset = (page - 1) * perPage;
      const urlTemp = req.url == '/' ? '/?page=1' : req.url;
      let url = '';

      for (let i = 0; i < urlTemp.length; i++) {
        if (urlTemp[i] === '/') {
          i++;
        }
        url += urlTemp[i];
      }

      let sql = `SELECT * FROM public.iklan`;

      if (filter.length > 0) {
        sql += ` WHERE`;
        for (let i = 0; i < field.length; i++) {
          switch (field[i]) {
            case 'kategori':
              sql += ` ${field[i]} = ${filter[i]}`;
              break;
            case 'provinsi':
              sql += ` ${field[i]} = ${filter[i]}`;
              break;
            case 'kota':
              sql += ` ${field[i]} = ${filter[i]}`;
              break;
            case 'harga':
              sql += ` ${field[i]} = ${filter[i]}`;
              break;
          }
          if (i !== field.length - 1) sql += ` AND`;
        }
      }

      if (filter.length < 2) {
        sql += ` ORDER BY idiklan ASC`;
      }

      sql += ` LIMIT ${perPage} OFFSET ${offset}`;

      pool.query(sql, (err, rows) => {
        if (err) console.log(err);

        res.render('index', {
          data: rows.rows,
          query: queries,
          current: page,
          pages,
          url,
          user: req.session.user
        });
      });
    });
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
    res.render('pass', { title: 'Reset password', info: req.flash('info') });
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
    pool.query('SELECT * FROM public.iklan WHERE iduser = $1', [req.session.user.iduser], (err, data) => {
      if (err) throw err;

      res.render('ads', { title: 'Create Ads', data: data.rows, info: req.flash('info'), user: req.session.user });
    });
  });

  router.post('/ads', function (req, res, next) {
    const { kategori, judul, luastanah, luasbangunan, kamartidur, kamarmandi, lantai, fasilitas, carport, sertifikasi, harga, deskripsi, provinsi, kota, alamat, lat, lng } = req.body;

    pool.query(`INSERT INTO public.iklan (kategori, judul, luastanah, luasbangunan, kamartidur, kamarmandi, lantai, fasilitas, carport, sertifikasi, harga, gambar, deskripsi, provinsi, kota, alamat, lat, lng, iduser)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`, [kategori, judul, luastanah, luasbangunan, kamartidur, kamarmandi, lantai, fasilitas, carport, sertifikasi, harga, req.files.image.name, deskripsi, provinsi, kota, alamat, lat, lng, req.session.user.iduser], err => {
      if (err) throw err;
      console.log(req.files.image.name);
      req.flash('info', "Yeay, your ads has been added!");
      res.redirect('/ads')
    });

    // let image = req.files.image.name;
  
    // image.mv('./uploads/' + image, function (err) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     alert('File uploaded!');
    //   }
    // })
  });

  // list ads
  router.get('/listads', function (req, res, next) {
    pool.query('SELECT * FROM public.iklan WHERE iduser = $1', [req.session.user.iduser], (err, data) => {
      if (err) throw err;

      res.render('listads', { title: 'List Ads', data: data.rows, info: req.flash('info'), user: req.session.user });
    });
  });

  // edit ads
  router.get('/editads/:id', function (req, res, next) {
    pool.query('SELECT * FROM public.iklan WHERE idiklan = $1', [req.params.id], (err, data) => {
      if (err) throw err;

      res.render('editads', { title: 'Edit Ads', data: data.rows[0], info: req.flash('info'), user: req.session.user });
    });
  });

  router.post('/editads/:id', function (req, res, next) {
    console.log(req.body);
    const { kategori, judul, luastanah, luasbangunan, kamartidur, kamarmandi, lantai, fasilitas, carport, sertifikasi, harga, gambar, deskripsi, provinsi, kota, alamat } = req.body;

    pool.query('UPDATE public.iklan SET kategori = $1, judul = $2, luastanah = $3, luasbangunan = $4, kamartidur = $5, kamarmandi = $6, lantai = $7, fasilitas = $8, carport = $9, sertifikasi = $10, harga = $11, gambar = $12, deskripsi = $13, provinsi = $14, kota = $15, alamat = $16 WHERE idiklan = $17)', [kategori, judul, luastanah, luasbangunan, kamartidur, kamarmandi, lantai, fasilitas, carport, sertifikasi, harga, gambar, deskripsi, provinsi, kota, alamat, req.params.id], (err) => {
      if (err) throw err;

      req.flash('info', "Yeay, your ads has been updated!");
      res.redirect('/editads');
    });
  });

  // delete ads
  router.get('/deleteads/:id', function (req, res, next) {
    pool.query('DELETE FROM public.iklan WHERE idiklan = $1', [req.params.id], (err) => {
      if (err) throw err;

      res.redirect('/listads');
    });
  });

  // details
  router.get('/details/:id', function (req, res, next) {
    pool.query('SELECT * FROM public.iklan WHERE idiklan = $1', [req.params.id], (err, data) => {
      if (err) throw err;

      res.render('details', { title: 'Edit Ads', data: data.rows[0], user: req.session.user });
    });
  });

  return router;
}
