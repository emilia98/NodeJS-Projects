const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/memedb';

const Genre = require('./../models/Genre');
const Meme = require('./../models/Meme');

mongoose.Promise = global.Promise;

module.exports = mongoose.connect(connectionString, () => {

});