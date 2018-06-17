const mongoose = require('mongoose');
const validations = require('../app_modules/db-validations');

function showRequiredMessage (msg) {
  return '{0} is required'.replace('{0}', msg);
}

let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: showRequiredMessage('Username'),
    unique: true
  },
  hashedPass: {
    type: String,
    required: showRequiredMessage('Password')
  },
  salt: {type: String, required: true},
  fullName: {
    type: String,
    required: showRequiredMessage('Name')
  },
  age: {
    type: Number,
    required: showRequiredMessage('Age'),
    validate: validations.age
  },
})