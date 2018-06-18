const mongoose = require('mongoose');
const validations = require('../app_modules/db-validations');
const ObjectId = mongoose.Schema.ObjectId;

function showRequiredMessage (msg) {
  return '{0} is required'.replace('{0}', msg);
}

let carSchema = mongoose.Schema({
  brand: {
    type: String,
    required: showRequiredMessage('Brand'),
  },
  model: {
    type: String,
    required: showRequiredMessage('Model')
  },
  imageSrc: {
    type: String,
    required: showRequiredMessage('Image Source'),
  },
  productionYear: {
    type: Number,
    required: showRequiredMessage('Year'),
    validate: validations.productionYear
  },
  seats: {
    type: Number,
    required: showRequiredMessage('Seats'),
    validate: validations.seats
  },
  transmission: {
    type: String,
    required: showRequiredMessage('Transmision'),
    enum: {
      values: ['Manual', 'Auto'],
      message: 'The transmission should be either Manual, or Auto.'
    }
  },
  rentedBy: [
    {type: ObjectId, ref: 'User'}
  ],
  color: {
    type: String
  },
  isRented: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: showRequiredMessage('Price'),
    validate: validations.price
  }
});

let Car = mongoose.model('Car', carSchema);

module.exports = Car;
