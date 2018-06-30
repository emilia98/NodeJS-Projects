const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');

const publicFiles = path.normalize(
  path.join(__dirname, '../public')
);

module.exports = (app, config) => {
  app.use('/public', express.static(publicFiles));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  // Set up the view engine
  app.engine('.hbs', hbs({
    extname: '.hbs',
    partialsDir: 'views/partials'
  }));
  app.set('view engine', '.hbs');
};
