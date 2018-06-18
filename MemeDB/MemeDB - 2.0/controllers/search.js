const Genre = require('./../models/Genre');
const Meme = require('./../models/Meme');
const qs = require('querystring');
const url = require('url');

async function search (req, res) {
  let query = qs.parse(url.parse(req.url).query);

  if (req.url === '/search') {
    let genres = await Genre.find({});
    res.render('search', {
      genres: genres
    });
  } else {
    let memeTitle = query.memeTitle;
    let selectedGenre = query.genreSelect;

    let genreQuery = {};
    let memeQuery = {};

    if (selectedGenre.length > 0) {
      genreQuery.genreName = selectedGenre;
    }

    if (memeTitle.length > 0) {
      memeQuery.title = memeTitle;
    }

    let genres = await Genre.find(genreQuery);
    let memeIds = [];

    for (let genre of genres) {
      let memes = genre.memeList;
      for (let id of memes) {
        if (!memeIds.includes(id)) {
          memeIds.push(id);
        }
      }
    }

    let allMemes = await Meme.where('_id').in(memeIds).find(memeQuery);

    genres = await Genre.find({});
    res.render('search', {
      memes: allMemes,
      genres: genres
    });
  }
}

module.exports = {
  getSearchForm: (req, res) => getSearchForm(req, res),
  search: (req, res) => search(req, res)
};
