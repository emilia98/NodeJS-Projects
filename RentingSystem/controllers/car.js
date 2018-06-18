const Car = require('../models/Car');
const car = require('../app_modules/car');
const router = require('express').Router();

const authentication = require('../app_modules/authentication');

router
  .route('/create')
  .get(authentication.isAuthenticated,
    authentication.isAdmin,
    (req, res) => {
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
      let [isAdmin, isUser] = authentication.roles(req);

      console.log(req.session);
      res.render('car/create', {
        nested: '../',
        errors: req.session.messages,
        brand: req.session.inputData.brand,
        model: req.session.inputData.model,
        color: req.session.inputData.color,
        productionYear: req.session.inputData.productionYear,
        seats: req.session.inputData.seats,
        imageSrc: req.session.inputData.imageSrc,
        price: req.session.inputData.price,
        isAdmin: isAdmin,
        isUser: isUser,
        isAnonymous: !isUser
      });
    })
  .post((req, res) => {
    car.create(req, res);
  });

router.get('/all', (req, res) => {
  car.listAll(req, res);
});

router.get('/details/:id', authentication.isUser, (req, res) => {
  car.showDetails(req, res);
});

router.get('/edit/:id',
  authentication.isAuthenticated,
  authentication.isAdmin, (req, res) => {
  car.edit(req, res);
});

router.post('/edit/:id', authentication.isAuthenticated,
  authentication.isAdmin, (req, res) => {
  // console.log('HEERE');
  car.editPost(req, res);
});

router.get('/rent/:id', authentication.isAuthenticated, (req, res) => {
  car.rentCar(req, res);
});
module.exports = router;
