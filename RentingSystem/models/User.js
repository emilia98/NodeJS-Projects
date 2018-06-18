const mongoose = require('mongoose');
const validations = require('../app_modules/db-validations');
const ObjectId = mongoose.Schema.ObjectId;

function showRequiredMessage (msg) {
  return '{0} is required'.replace('{0}', msg);
}

let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: showRequiredMessage('Username'),
    unique: true
  },
  hashedPassword: {
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
  email: {
    type: String,
    required: showRequiredMessage('Email'),
    validate: validations.email
  },
  role: {
    type: String,
    default: 'User',
    enum: {
      values: ['Admin', 'User']
    }
  },
  rentedCars: [
    { type: ObjectId,
      ref: 'Car'
    }]
});

module.exports = mongoose.model('User', userSchema);
