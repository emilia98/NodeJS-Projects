const encryption = require('./encryption');
const authentication = require('../app_modules/authentication');
const User = require('../models/User');
const Car = require('../models/Car');

async function registerUser (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let repeatPass = req.body.repeat;
  let email = req.body.email;
  let age = req.body.age;
  let fullName = req.body.fullName;

  let user = await User.findOne({username: username});

  req.session.inputData = {
    username,
    fullName,
    email,
    age
  };

  if (user !== null) {
    req.session.messages = ['This username is already taken!'];
    res.redirect('/user/register');
    return;
  }

  if (password !== repeatPass) {
    req.session.messages = ['The two passwords do not match!'];
    res.redirect('/user/register');
    return;
  }

  let salt = encryption.generateSalt();
  let hashedPassword = encryption.generateHashedPassword(salt, password);

  let registerUser = new User({
    username: username,
    fullName: fullName,
    hashedPassword: hashedPassword,
    salt: salt,
    email: email,
    age: age
  });

  let newUser;

  try {
    newUser = await registerUser.save();
    req.session.user = {
      username
    };
  } catch (errors) {
    let messages = [];
    let errorNames = errors.errors;

    for (let error in errorNames) {
      messages.push(errorNames[error].message);
    }

    req.session.messages = messages;
    res.redirect('/user/register');
    return;
  }

  await req.login(newUser, err => {
    if (err) {
      return 'Something went wrong...';
    }

    req.session.user = {
      username
    };
    res.redirect('/');
  });
}

async function showMyProfile (req, res) {
  let user = await User.findById(req.user.id);

  let [isAdmin, isUser] = authentication.roles(req);

  let allRented = await Car.where('_id').in(user.rentedCars);

  res.render('user/me', {
    nested: '/',
    username: user.username,
    rentedCars: allRented,
    isAdmin: isAdmin,
    isUser: isUser,
    isAnonymous: !isUser
  });
}

module.exports = {
  register: (req, res) => registerUser(req, res),
  showMyProfile: (req, res) => showMyProfile(req, res)
};
