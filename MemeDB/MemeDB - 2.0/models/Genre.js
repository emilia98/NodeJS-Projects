const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const genreSchema = mongoose.Schema({
  genreName: {type: String, required: true},
  memeList: [{type: ObjectId}]
});

let Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
