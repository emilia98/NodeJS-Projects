const Country = require('../models/Country');
const fs = require('fs');
const path = require('path');
const filePath = path.normalize(
  path.join(__dirname, '../utilities/countries.json')
);

module.exports.allCountries = async (req, res) => {
    let readFile = (filePath) => {
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
              reject(err);
              return;
            }
      
            resolve(data);
          });
        });
      };
      
      
      (async () => {
          let file = await readFile(filePath);
          let data = JSON.parse(file);
      
          for (let entry of data) {
              // console.log(entry);
            storeEntry(entry);
              // break;
          }
      })();
      
      async function storeEntry (entry) {
          let country = new Country({
              name: entry.name,
              ISOCode: entry.code.toLowerCase()
          });
          
           let newCountry;
         
          try {
              newCountry = await country.save();
          } catch (err) {
              return;
          }
      }
}

module.exports.getSome = async (req, res) => {
    let query = req.params.query;
    let countries;

    try {
        countries = await Country.find().sort({name: 1});
        countries = countries.filter(c => {
            return c.name.toLowerCase().includes(query.toLowerCase());
        });
    } catch (err) {
        countries = 0;
    }
    res.status(200).json(countries.slice(0, Math.min(15, countries.length)));
};
