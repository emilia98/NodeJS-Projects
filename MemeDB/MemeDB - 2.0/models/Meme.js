const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const memeSchema = mongoose.Schema({
  title: {type: String, required: true},
  creationDate: {type: Date, required: true, default: Date.now},
  votes: {type: Number, required: true, default: 0},
  description: {type: String, default: ''},
  imageUrl: {type: String, required: true},
  genre: {type: ObjectId, required: true}
});

let Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;
