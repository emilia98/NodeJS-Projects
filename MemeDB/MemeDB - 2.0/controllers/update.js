const Meme = require('./../models/Meme');
const Genre = require('./../models/Genre');
const formidable = require('formidable');

async function updateGetMeme (req, res) {
  let memeId = req.params.id;
  let meme;

  try {
    meme = await Meme.findById(memeId);
  } catch (err) {
    res.render('error', {
      message: 'Cannot find a meme with this id...'
    });
    return;
  }

  let choosenGenre = await Genre.findById(meme.genre);
  let genres = await Genre.find({});
  genres = genres.map(el => el.genreName);

  res.render('update-meme', {
    description: meme.description,
    title: meme.title,
    defaultGenre: choosenGenre.genreName,
    genres: genres,
    id: memeId
  });
}

async function updateMeme (memeId, meme, res) {
  try {
    let originalMeme = await Meme.findById(memeId);
    let oldGenre = await Genre.findById(originalMeme.genre).exec();
    let newGenre = await Genre.find({'genreName': meme.genre}).exec();
    newGenre = newGenre[0];

    let genreId = newGenre._id;
    originalMeme.description = meme.description;
    originalMeme.title = meme.title;
    originalMeme.genre = genreId;

    let updatedMeme = await originalMeme.save();

    newGenre.memeList.push(updatedMeme._id);
    let memeIndex = oldGenre.memeList.indexOf(memeId);
    oldGenre.memeList.splice(memeIndex, 1);
    await oldGenre.save();
    await newGenre.save();
  } catch (err) {
    res.render('error', {
      message: 'Error when updating a meme'
    });
    return;
  }

  res.redirect(`/details/meme/${memeId}`);
}

async function updatePutMeme (req, res) {
  let memeId = req.params.id;
  let meme = {};
  let readyToSave = false;
  let form = formidable.IncomingForm();

  let genres = await Genre.find({});
  genres = genres.map(el => el.genreName);

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }

    let selectedGenre = fields.genreSelect;
    let memeTitle = fields.memeTitle;
    let memeDescription = fields.memeDescription;

    let notSelected = genres.slice(0);
    let selectedIndex = genres.indexOf(selectedGenre);

    if (selectedIndex === -1) {
      res.render('forbidden', {
        message: `What you've done is forbidden... Adding genres is not allowed!!!`,
        linkPath: '/add/meme/'
      });
      return;
    }

    notSelected.splice(selectedIndex, 1);

    if (memeTitle.length === 0) {
      res.render('update-meme', {
        description: memeDescription,
        genres: genres,
        defaultGenre: selectedGenre,
        message: 'Cannot send meme with no title',
        'element-id': 'error'
      });

      return;
    }

    // If the genre is missing, send a message to the user
    if (selectedGenre.length === 0) {
      res.render('update-meme', {
        title: memeTitle,
        description: memeDescription,
        genres: genres,
        message: 'Cannot send meme with no genre',
        'element-id': 'error'
      });
      return;
    }

    // If everything is ok, we are ready to form the meme
    readyToSave = true;

    meme = {
      title: memeTitle,
      description: memeDescription,
      genre: selectedGenre
    };
  });

  form.on('end', () => {
    if (readyToSave) {
      updateMeme(memeId, meme, res);
      return;
    }

    // This scenario is not expected, but if we do something unexpected
    // the next action will be to redirect to form for adding meme
    res.redirect('/view/memes');
  });
}

module.exports = {
  updateGetMeme: (req, res) => updateGetMeme(req, res),
  updatePutMeme: (req, res) => updatePutMeme(req, res)
};
