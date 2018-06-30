const express = require('express');
const app = express();
const routes = require('./routes/home');
const config = require('./config/config');
const expressConfig = require('./config/express');
const database = require('./config/database');
const port = 5000;

const environment = process.env.NODE_ENV || 'development';

expressConfig(app, config[environment]);
database(config[environment]);
routes(app);

app.listen(port, () => {
  console.log(`The app is running on port ${port}...`);
});
