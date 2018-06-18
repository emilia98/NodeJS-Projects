const Genre = require('./../models/Genre');
const Meme = require('./../models/Meme');
const formidable = require('formidable');
const path = require('path');

/*
 Get all genres from the database and render the
 form for adding meme.
*/
async function showMemeForm (req, res) {
  let genres = await Genre.find({});
  let allGenres = genres.map(el => el.genreName);
  res.render('add-meme', {
    genres: allGenres
  });
  return allGenres;
}

async function saveMeme (meme, res) {
  try {
    let genre = await Genre.findOne({genreName: meme.genre});

    let newMeme = new Meme({
      title: meme.title,
      description: meme.description,
      imageUrl: meme.imageUrl,
      genre: genre._id
    });

    let savedMeme = await newMeme.save();
    genre.memeList.push(savedMeme._id);
    await genre.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect('/view/memes');
}

async function postMemeData (req, res, allGenres) {
  let uploadDir = path.normalize(
    path.join(__dirname, './../public/uploads')
  );

  let meme = {};
  let readyToSave = false;
  let form = formidable.IncomingForm({
    uploadDir: uploadDir,
    keepExtensions: true
  });

  if (allGenres.length === 0) {
    let genres = await Genre.find({});
    allGenres = genres.map(el => el.genreName);
    res.render('add-meme', {
      genres: allGenres,
      message: 'There is a server error - No genres were loaded.',
      'element-id': 'error',
      reload: true
    });
    return;
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }

    let selectedGenre = fields.genreSelect;
    let memeTitle = fields.memeTitle;
    let memeImage = files.meme.name;
    let memeDescription = fields.memeDescription;

    let notSelected = allGenres.slice(0);
    let selectedIndex = allGenres.indexOf(selectedGenre);

    if (selectedIndex === -1) {
      res.render('forbidden', {
        message: `What you've done is forbidden... Adding genres is not allowed!!!`,
        linkPath: '/add/meme/'
      });
      return;
    }
    notSelected.splice(selectedIndex, 1);

    if (memeTitle.length === 0) {
      res.render('add-meme', {
        description: memeDescription,
        genres: allGenres,
        defaultGenre: selectedGenre,
        message: 'Cannot send meme with no title',
        'element-id': 'error'
      });
      return;
    }

    // If the image is missing, send a message to the user
    if (memeImage.length === 0) {
      res.render('add-meme', {
        title: memeTitle,
        description: memeDescription,
        genres: allGenres,
        defaultGenre: selectedGenre,
        message: 'Cannot send meme with no image',
        'element-id': 'error'
      });
      return;
    }

    // If the genre is missing, send a message to the user
    if (selectedGenre.length === 0) {
      res.render('add-meme', {
        title: memeTitle,
        description: memeDescription,
        genres: allGenres,
        message: 'Cannot send meme with no genre',
        'element-id': 'error'
      });
      return;
    }

    // If everything is ok, we are ready to form the meme
    readyToSave = true;

    let memeImgPath = files.meme.path;
    let imageUrl = memeImgPath.match(/\\public\\.+/)[0];
        
    meme = {
      title: memeTitle,
      description: memeDescription,
      imageUrl: path.normalize(imageUrl),
      genre: selectedGenre
    };
  });

  form.on('end', () => {
    if (readyToSave) {
      saveMeme(meme, res);
    }

    // This scenario is not expected, but if we do something unexpected
    // the next action will be to redirect to form for adding meme
    // res.redirect('/view/memes');
  });
}

module.exports = {
  getAddMeme: (req, res) => showMemeForm(req, res),
  postAddMeme: (req, res, allGenres) => postMemeData(req, res, allGenres)
};
