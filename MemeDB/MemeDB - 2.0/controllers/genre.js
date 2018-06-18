const Genre = require('./../models/Genre');

function showAddGenre (req, res) {
  res.render('add-genre', {
    'hasMessage': false
  });
}

function createGenre (req, res) {
  let genreTitle = req.body.genreTitle;

  Genre.find({'genreName': genreTitle})
    .then((genres) => {
      if (genres.length === 0) {
        let genre = new Genre({
          genreName: genreTitle,
          memeList: []
        });

        genre.save()
          .then(g => {
            res.redirect('/view/genres');
          })
          .catch(err => console.log(err));
      } else {
        res.render('add-genre', {
          hasMessage: true,
          message: 'This genre already exists!',
          genre: genreTitle,
          'element-type': 'error'
        });
      }
    });
}

module.exports = {
  getGenre: (req, res) => showAddGenre(req, res),
  postGenre: (req, res) => createGenre(req, res)
};
