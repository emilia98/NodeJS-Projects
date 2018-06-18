const Genre = require('./../models/Genre');
const Meme = require('./../models/Meme');

/*
    Here we delete the genre by the provided id
    and all corresponding memes
*/
async function deleteGenre (req, res) {
  let genreId = req.params.id;

  try {
    await Genre.findById(genreId).remove();
  } catch (err) {
    res.render('error', {
      message: 'There is no genre with this id'
    });
    return;
  }

  try {
    await Meme.find({ 'genre': genreId }).remove();
    res.redirect('/view/genres');
  } catch (err) {
    res.render('error', {
      message: 'An error ocurred while deleting. Report the error to the admin...'
    });
  }
}

async function deleteMeme (req, res) {
  let memeId = req.params.id;
  let meme;

  try {
    meme = await Meme.findById(memeId);
  } catch (err) {
    res.render('error', {
      message: 'There is no meme with this id'
    });
    return;
  }

  try {
    let genreId = meme.genre;

    let genre = await Genre.findById(genreId);
    let memeIndex = genre.memeList.indexOf(memeId);
    genre.memeList.splice(memeIndex, 1);

    await meme.remove();

    await genre.save();
  } catch (err) {
    res.render('error', {
      message: 'An error occurred while deleting. Please, refresh the page...'
    });
    return;
  }

  res.redirect('/view/memes');
}

module.exports = {
  deleteGenre: (req, res) => deleteGenre(req, res),
  deleteMeme: (req, res) => deleteMeme(req, res)
};
