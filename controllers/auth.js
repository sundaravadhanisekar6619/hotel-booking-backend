const crypto = require('crypto');
const session = require('express-session');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { log } = require('console');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0)
    {
      message = message[0];
    }
    else {
      message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
          email: '',
          password: ''
        },
        validationErrors: []
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    req.session.isLoggedIn = true;
    req.session.user = '';
    return req.session.save((err) => {
        res.redirect('/users');
    });
    
    const errors = validationResult(req);
    console.log(errors.array()); 
    if (!errors.isEmpty()){
     return res.status(422).render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password
        },
        validationErrors: errors.array()
    })
    }

    User.findOne({ email: email })
    .then(user => {
        if(!user)
        {
            return res.status(422).render('auth/login', {
              pageTitle: 'Login',
              path: '/login',
              isAuthenticated: false,
              errorMessage: 'Invalid email or password',
              oldInput: {
                email: email,
                password: password
              },
              validationErrors: errors.array()
          })
        }
        bcrypt
        .compare(password, user.password)
        .then(doMatch => {
            
            if (doMatch){
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save((err) => {
                    res.redirect('/users');
                });
            }
            return res.status(422).render('auth/login', {
              pageTitle: 'Login',
              path: '/login',
              isAuthenticated: false,
              errorMessage: 'Invalid email or password',
              oldInput: {
                email: email,
                password: password
              },
              validationErrors: []
          })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        })

    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect('/login');
    });
  }

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0)
    {
      message = message[0];
    }
    else {
      message = null;
    }
    res.render('auth/reset', {
      pageTitle: 'Reset Password',
      path: '/reset',
      isAuthenticated: false,
      errorMessage: message
  })
};

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
      if (err){
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({ where: { email } })
      .then(existingUser => {
        if (!existingUser){
          req.flash('error', 'No account with that email found.');
          return res.redirect('/login');
        }
        existingUser.resetToken = token;
        existingUser.resetTokenExpiration = Date.now() + 3600000;
        return existingUser.save();
      })
      .then(result => {
        res.redirect('/');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  
    })
  };

  exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne( {where: { resetToken: token, resetTokenExpiration: { $gt: Date.now() } }  })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0)
      {
        message = message[0];
      }
      else {
        message = null;
      }
      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        isAuthenticated: false,
        errorMessage: message,
        userId : user.id.toString(),
        passwordToken: token
    })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
  };
  
  exports.postNewPassword = (req, res, next) => {
    const newpassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    User.findOne( { where:{
      resetToken: passwordToken, 
      resetTokenExpiration: { gt: Date.now() },
      id: userId
     } } )
     .then(user => {
      resetUser = user;
      bcrypt.hash(newpassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          res.redirect('/error');
          return;
        }
        resetUser.password = hashedPassword;
        resetUser.resetToken = null;
        resetUser.resetTokenExpiration = null;
        return resetUser.save()
        .then(result => {
          res.redirect('/login');
        })
      })
      
     })
     .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
     })
  };
