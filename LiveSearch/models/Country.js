const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

const countrySchema = mongoose.Schema({
    name: {
        type: String,
        
    },
    ISOCode: {
        type: String,
    }
});

let Country = mongoose.model('Country', countrySchema);

module.exports = Country;
