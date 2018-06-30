const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = (config) => {
  mongoose.connect(config.connectionString);
  let database = mongoose.connection;

  if (database.readyState === 0) {
    throw Error('Error connecting to database...');
  }

  console.log('Connected to database...');
};