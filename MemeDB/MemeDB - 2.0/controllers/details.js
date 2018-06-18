const Genre = require('./../models/Genre');
const Meme = require('./../models/Meme');

async function getGenreDetails (req, res) {
  // Get the genre by the provided id
  let genreId = req.params.id;
  let genre = await Genre.findById(genreId);

  // Get the memes by the provided ids in thee memeList
  let memesId = genre.memeList;
  let memes = await Meme.where('_id').in(memesId);

  // Render the view with the given information
  res.render('details', {
    isMeme: false,
    genreName: genre.genreName.toLowerCase(),
    memes: memes,
    genreId: genreId
  });
}

async function getMemeDetails (req, res) {
  let memeId = req.params.id;
  let meme = await Meme.findById(memeId);

  let genreId = meme.genre;
  let genre = await Genre.findById(genreId);

  res.render('details', {
    isMeme: true,
    title: meme.title,
    description: meme.description,
    imageSrc: meme.imageUrl,
    genre: genre.genreName,
    genreId: genreId,
    memeId: meme._id
  });
}

module.exports = {
  getGenreDetails: (req, res) => getGenreDetails(req, res),
  getMemeDetails: (req, res) => getMemeDetails(req, res)
};
