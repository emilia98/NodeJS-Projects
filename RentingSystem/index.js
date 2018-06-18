const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const passport = require('passport');
const LocalPassport = require('passport-local');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 8080;

const User = require('./models/User');
const encryption = require('./app_modules/encryption');
const authentication = require('./app_modules/authentication');
/* Static files */
const publicFilesPath = path.normalize(
  path.join(__dirname, '/public')
);
app.use('/public', express.static(publicFilesPath));

app.engine('.hbs', hbs({
  extname: '.hbs',
  partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');

app.use(session({
  secret: 'keyboard cat !@#'
}));

const db = require('./config/database');
const userRouter = require('./controllers/user');
const carRouter = require('./controllers/car');

passport.use(new LocalPassport(async (username, password, done) => {
  let user = await User.findOne({username: username});

  if (user !== null) {
    let userSalt = user.salt;
    let userPass = user.hashedPassword;
    let hashedInput = encryption.generateHashedPassword(userSalt, password);

    if (hashedInput === userPass) {
      return done(null, user);
    }

    return done('Incorrect password', false);
  }
  return done(null, false);
}));

passport.serializeUser((user, done) => {
  if (user) {
    return done(null, user._id);
  }
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  if (user) {
    return done(null, user);
  }
  return done(null, false);
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session({pauseStream: true}));

db.then(() => {
  console.log('Connected to DB...');

  app.get('/', (req, res) => {
    let username = 'anonymous';
    let [isAdmin, isUser] = authentication.roles(req);
    if (req.session.user) {
      username = req.session.user.username;
    }

    if (req.session.inputData) {
      req.session.inputData = {};
    }

    if (req.session.messages) {
      req.session.messages = [];
    }

    res.render('home', {
      isAdmin: isAdmin,
      isUser: isUser,
      isAnonymous: !isUser,
      username
    });
  });

  app.get('/forbidden', (req, res) => {
   
    res.render('forbidden');
  });

  app.use('/user', userRouter);
  app.use('/car', carRouter);

  app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
  });
}).catch((err) => {
  if (err) {
    console.log(err);
    console.log('Error connecting to database...');
  }
});
