let date = new Date();
let fullYear = date.getFullYear();

function checkForInteger (val) {
  return Number.isInteger(val);
}

function checkIfMajor (val) {
  return val >= 18;
}

function checkForProductionYear (val) {
  return val >= 1995 && val <= fullYear;
}

let ageValidators = [
  { validator: checkForInteger, msg: 'The age should be an integer' },
  { validator: checkIfMajor, msg: 'You should be at least 18 years old.' }
];

let productionYearValidation = [
  { validator: checkForInteger, msg: 'The year should be an integer' },
  { validator: checkForProductionYear,
    msg: `The year should be between 1995 and ${fullYear}`
  }
];

let seatsValidation = [
  { validator: checkForInteger, msg: 'The seats count should be an integer' }
];

module.exports = {
  age: ageValidators,
  productionYear: productionYearValidation,
  seats: seatsValidation
};
