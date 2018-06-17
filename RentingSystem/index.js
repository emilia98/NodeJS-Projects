const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const app = express();
const port = 8080;

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

const db = require('./config/database');

db.then(() => {
  console.log('Connected to DB...');

  app.get('/', (req, res) => {
    res.render('home');
  });

  app.listen(port, () => {
    console.log(`App is running on port ${port}...`);
  });
}).catch((err) => {
  if (err) {
    console.log(err);
    console.log('Error connecting to database...');
  }
});
