const Meme = require('./../models/Meme');
const Genre = require('./../models/Genre');

async function showAllMemes (req, res) {
  let memes = await Meme.find({}).exec();

  res.render('view', {
    memes: memes,
    areMemes: true
  });
}

async function showAllGenres (req, res) {
  let genres = await Genre.find({});

  res.render('view', {
    genres: genres,
    areMemes: false
  });
}

module.exports = {
  getAllMemes: (req, res) => showAllMemes(req, res),
  getAllGenres: (req, res) => showAllGenres(req, res)
};
