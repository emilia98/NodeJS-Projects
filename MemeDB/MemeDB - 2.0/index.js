const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const path = require('path');
const app = express();
const port = 5000;

const memeController = require('./controllers/meme');
const genreController = require('./controllers/genre');
const viewController = require('./controllers/view');
const detailsController = require('./controllers/details');
const deleteController = require('./controllers/delete');
const updateController = require('./controllers/update');
const searchController = require('./controllers/search');

let allGenres = [];

// Set up the view engine -> Handlebars (in this case)
app.engine('.hbs', handlebars({
  extname: '.hbs',
  partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');

const Genre = require('./models/Genre');
const Meme = require('./models/Meme');

const publicFilesPath = path.join(__dirname, 'public');

async function getGenres () {
  let genres = await Genre.find({});
  return genres;
}

const db = require('./config/dbConfig');

db.then(() => {
  console.log('Conntected to DB...');

  // Specify how to serve the static files (in this case in a folder, called 'public')
  app.use('/public', express.static(publicFilesPath));
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing 

  app.get('/', (req, res) => {
    res.render('home');
  });

  app
    .route('/add/meme')
    .get((req, res) => {
      (async () => {
        allGenres = await memeController.getAddMeme(req, res);
      })();
    })
    .post((req, res) => {
      (async () => {
        await memeController.postAddMeme(req, res, allGenres);
      })();
    });

  app.route('/add/genre')
    .get((req, res) => {
      genreController.getGenre(req, res);
    })
    .post((req, res) => {
      genreController.postGenre(req, res);
    });

  app.get('/forbidden', (req, res) => {
    res.render('forbidden', {
      message: ``,
      linkPath: '/'
    });
  });

  app.get('/view/memes', (req, res) => {
    viewController.getAllMemes(req, res);
  });

  app.get('/view/genres', (req, res) => {
    viewController.getAllGenres(req, res);
  });

  app.get('/details/meme/:id', (req, res) => {
    detailsController.getMemeDetails(req, res);
  });

  app.get('/details/genre/:id', (req, res) => {
    detailsController.getGenreDetails(req, res);
  });

  app.get('/download/*', (req, res) => {

    let filePath = path.normalize(
      path.join(__dirname, req.params[0])
    );

    let fileName = req.params[0].match(/upload_(.?)+/)[0];
    fileName = fileName.replace('upload_', 'meme_');

    res.download(filePath, fileName, (err) => {
      if (err) {
        res.render('error', {
          message: 'There is not file on this path...'
        });
      }
    });
  });

  app.get('/delete/genre/:id', (req, res) => {
    deleteController.deleteGenre(req, res);
  });

  app.get('/delete/meme/:id', (req, res) => {
    deleteController.deleteMeme(req, res);
  });

  app.get('/update/meme/:id', (req, res) => {
    updateController.updateGetMeme(req, res);
  });

  app.post('/update/meme/:id', (req, res) => {
    updateController.updatePutMeme(req, res);
  });

  app.get('/search/?*', (req, res) => {
    searchController.search(req, res);
  });

  app.listen(port, () => {
    console.log(`The app is running on port ${port}...`);
  });
}).catch(err => {
  console.log(err);
});
