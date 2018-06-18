const Car = require('../models/Car');
const User = require('../models/User');
const authentication = require('../app_modules/authentication');

async function addCar (req, res) {
  let brand = req.body.brand;
  let model = req.body.model;
  let productionYear = req.body.productionYear;
  let seats = req.body.seats;
  let imageSrc = req.body.imageSrc;
  let color = req.body.color;
  let transmission = req.body.transmission;
  let price = req.body.price;

  let registerCar = new Car({
    brand: brand,
    model: model,
    imageSrc: imageSrc,
    productionYear: productionYear,
    seats: seats,
    transmission: transmission,
    rentedBy: [],
    color: color,
    price: price,
    isRented: false
  });

  req.session.inputData = {
    brand,
    model,
    color,
    productionYear,
    seats,
    imageSrc,
    price
  };

  let newCar;
  try {
    newCar = await registerCar.save();
  } catch (errors) {
    let messages = [];
    let errorNames = errors.errors;

    for (let error in errorNames) {
      messages.push(errorNames[error].message);
    }

    req.session.messages = messages;
    res.redirect('/car/create');
    return;
  }

  res.redirect('/');
}

async function listAll (req, res) {
  let cars = await Car.find({});

  let [isAdmin, isUser] = authentication.roles(req);

  res.render('car/all', {
    nested: '../',
    cars: cars,
    isAdmin: isAdmin,
    isUser: isUser,
    isAnonymous: !isUser
  });
}

async function showDetails (req, res) {
  let id = req.params.id;

  let car = await Car.findById(id);
  let [isAdmin, isUser] = authentication.roles(req);

  let options = {
    nested: '/',
    isAdmin: isAdmin,
    isUser: isUser,
    isAnonymous: !isUser
  };
  if (car) {
    options.car = car;
    res.render('car/details', options);
  } else {
    res.render('not-found', options);
  }
}

async function editCar (req, res) {
  let id = req.params.id;
  let car = await Car.findById(id);

  if (req.session.messages === undefined) {
    req.session.messages = [];
  }

  if (req.session.inputData === undefined) {
    req.session.inputData = {
      brand: '',
      model: '',
      color: '',
      productionYear: '',
      seats: '',
      imageSrc: '',
      price: ''
    };
  }

  res.render('car/edit', {
    errors: req.session.messages,
    nested: '/',
    id: car.id,
    brand: car.brand,
    model: car.model,
    imageSrc: car.imageSrc,
    productionYear: car.productionYear,
    seats: car.seats,
    transmission: car.transmission,
    color: car.color,
    price: car.price,
    isAdmin: true,
    isUser: true
  });
}

async function editPost (req, res) {
  let id = req.params.id;

  let car = await Car.findById(id);

  car.brand = req.body.brand;
  car.model = req.body.model;
  car.imageSrc = req.body.imageSrc;
  car.productionYear = req.body.productionYear;
  car.seats = req.body.seats;
  car.transmission = req.body.transmission;
  car.color = req.body.color;
  car.price = req.body.price;

  let storedCar;
  try {
    storedCar = await car.save();
  } catch (errors) {
    let messages = [];
    let errorNames = errors.errors;

    for (let error in errorNames) {
      messages.push(errorNames[error].message);
    }

    req.session.messages = messages;
    res.redirect('/car/edit/' + id);
    return;
  }

  res.redirect('/');
}

async function rentCar (req, res) {
  let id = req.params.id;
  let car = await Car.findById(id);
  let user = req.user;
  let userId = user._id;

  car.rentedBy.push(userId);
  car.isRented = true;
  user.rentedCars.push(car._id);

  let updatedCar = await car.save();
  let updatedUser = await user.save();

  res.redirect('/user/profile/me');
}

module.exports = {
  create: (req, res) => addCar(req, res),
  listAll: (req, res) => listAll(req, res),
  showDetails: (req, res) => showDetails(req, res),
  edit: (req, res) => editCar(req, res),
  editPost: (req, res) => editPost(req, res),
  rentCar: (req, res) => rentCar(req, res)
};
