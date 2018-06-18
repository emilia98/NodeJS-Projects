const router = require('express').Router();
const user = require('../app_modules/user');
const passport = require('passport');
const authentication = require('../app_modules/authentication');

router
  .route('/register')
  .get((req, res) => {
    if (req.session.inputData === undefined) {
      req.session.inputData = {
        username: '',
        email: '',
        age: 0,
        fullName: ''
      };
    }

    let [isAdmin, isUser] = authentication.roles(req);

    res.render('user/register', {
      nested: '../',
      errors: req.session.messages,
      username: req.session.inputData.username,
      email: req.session.inputData.email,
      age: req.session.inputData.age,
      fullName: req.session.inputData.fullName,
      isAdmin: isAdmin,
      isUser: isUser,
      isAnonymous: !isUser
    });
  })
  .post((req, res) => {
    user.register(req, res);
  });

router
  .route('/login')
  .get((req, res) => {
    let error = req.session.message === undefined ? undefined : req.session.message.error;

    let [isAdmin, isUser] = authentication.roles(req);

    res.render('user/login', {
      nested: '../',
      message: error,
      isAdmin: isAdmin,
      isUser: isUser,
      isAnonymous: !isUser
    });
  })
  .post(function (req, res, next) {
  /* look at the 2nd parameter to the below call */
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        req.session.message = {
          error: err
        };
        return res.redirect('/user/login');
      }

      if (!user) {
        req.session.message = {
          error: `This user does not exist!`
        };
        return res.redirect('/user/login');
      }

      req.login(user, function (err) {
        if (err) { return next(err); }
        req.session.user = {
          username: req.user.username
        };
        return res.redirect('/');
      });
    })(req, res, next);
  });

router
  .get('/logout', (req, res) => {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        return;
      }
      res.redirect('/');
    });
  });

router
  .get('/profile/me', authentication.isUser, (req, res) => {
    //console.log(req.user);
    user.showMyProfile(req, res);
  });

module.exports = router;
