const countryController = require('../controllers/country');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    app.get('/country/all', (req, res) => {
        countryController.allCountries();
        res.send();
    });

    app.get('/search', (req, res) => {
        res.render('search');
        // countryController.allCountries();
        // res.send();
    });

    app.get('/search/country/:query', countryController.getSome);
};
