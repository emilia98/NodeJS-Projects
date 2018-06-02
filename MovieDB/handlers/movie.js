const fs = require('fs');
const path = require('path');
const promisify = require('../modules/promisify');
const formidable = require('formidable');
const shortid = require('short-id');

let pageHtml;

const readFile = promisify(fs.readFile);
const copyFile = promisify(fs.copyFile);
const writeFile = promisify(fs.writeFile);

const addMoviePath = path.normalize(
  path.join(__dirname, '../dist/addMovie.html')
);

const viewAllPath = path.normalize(
  path.join(__dirname, '../dist/viewAll.html')
);
const detailsPath = path.normalize(
  path.join(__dirname, '../dist/details.html')
);
const dbPath = path.normalize(
  path.join(__dirname, '../config/movies.json')
);
const notFoundPage = path.normalize(
  path.join(__dirname, '../dist/page404.html')
);

async function details (req, res) {
  let uriTokens = req.pathname.split('/').filter(el => el !== '');
  let idToFind = uriTokens[2];
  let database = await readFile(dbPath, 'utf8');
  let movies = JSON.parse(database);
  let movieFound = null;

  for (let movie of movies) {
    if (movie.id === idToFind) {
      movieFound = movie;
      break;
    }
  }

  if (movieFound === null) {
    let error404 = await readFile(notFoundPage, 'utf8');
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end(error404);
    return;
  }

  for (let prop in movieFound) {
    if (movieFound[prop] === null) {
      movieFound[prop] = 'N/A';
    }
  }

  let detailsPage = await readFile(detailsPath, 'utf8');
  let template = `<div class="content">
  <img src="${movieFound.image}" alt="${movieFound.title}"/>
  <div><span class="label">Title: </span><h3 class="details">${movieFound.title}</h3></div>
  <div><span class="label">Year: </span><h3 class="details">${movieFound.year}</h3></div>
  <div><span class="label">Description: </span><p class="details"> ${movieFound.description}</p></div>
  </div>`;

  detailsPage = detailsPage.replace(
    '<div id="replaceMe">{{replaceMe}}</div>',
    template
  );

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end(detailsPage);
}

async function show (req, res) {
  let html = await readFile(viewAllPath, 'utf8');
  let database = await readFile(dbPath, 'utf8');
  let movies;

  try {
    movies = JSON.parse(database);
  } catch (err) {
    console.log(err);

    res.writeHead(503, {
      'Content-Type': 'text/html'
    });
    res.write('<h1>The site is currently unavailable!</h1>');
    res.end();
  }

  movies = movies.sort((a, b) => a.year - b.year);
  let moviesHtml = [];

  for (let movie of movies) {
    let currentMovie = `<div class="movie" data-id="${movie.id}"><img class="moviePoster" src="${movie.image}"/></div>`;
    moviesHtml.push(currentMovie);
  }

  html = html.replace('<div id="replaceMe">{{replaceMe}}</div>', moviesHtml.join(''));

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  res.write(html);
  res.end();
}

async function finish (req, res, obj) {
  try {
    await copyFile(obj.tempPath, obj.imagePath);
  } catch (err) {
    console.log(err);
    res.end();
    return;
  }

  let movie = obj.movie;
  let database;

  try {
    database = await readFile(dbPath, 'utf8');
  } catch (err) {
    if (err) {
      console.log(err);
      res.end();
      return;
    }
  }

  let json = JSON.parse(database);
  json.push(movie);

  try {
    await writeFile(dbPath, JSON.stringify(json));

    res.writeHead(302, {
      Location: '/'
    });
    res.end();
  } catch (err) {
    if (err) {
      console.log(err);
      res.end();
    }
  }
}

async function add (req, res) {
  let hasErrors = false;
  try {
    pageHtml = await readFile(addMoviePath, 'utf8');
  } catch (err) {
    if (err) {
      console.log(err);
      res.end();
    }
  }

  if (req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write(pageHtml);
    res.end();
  } else if (req.method === 'POST') {
    let form = new formidable.IncomingForm();
    let movie = {};
    let title, year, image, description;

    let imagePath;
    let tempPath;
    let permanentPath;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        return;
      }

      title = fields.movieTitle;
      year = fields.movieYear;
      description = fields.movieDescription;
      image = files.moviePoster;
      let imageName = image.name;

      if (title.length !== 0 && year.length !== 0 &&
        description.length !== 0 && imageName.length !== 0) {
        imagePath = path.normalize(
          path.join(__dirname, '../public/uploads', imageName)
        );

        tempPath = image.path;

        permanentPath = path.normalize(
          path.join('/public/uploads', image.name)
        );
        hasErrors = false;
      } else {
        hasErrors = true;
      }
    });

    form.on('end', () => {
      if (hasErrors === false) {
        movie = {
          id: shortid.generate(),
          title,
          year: parseInt(year),
          description: description,
          image: permanentPath
        };

        let obj = {
          movie,
          tempPath,
          imagePath
        };

        finish(req, res, obj);
      } else {
        res.writeHead(302, {
          Location: '/forbidden'
        });
        res.end();
        // return;
      }
    });
  } else {
    return true;
  }
}

function addMovie (req, res) {
  if (req.pathname === '/addMovie') {
    add(req, res);
  } else {
    return true;
  }
}

function showAll (req, res) {
  if (req.pathname === '/viewAllMovies' && req.method === 'GET') {
    show(req, res);
  } else {
    return true;
  }
}

function showDetails (req, res) {
  if (req.pathname.startsWith('/movies/details/') && req.method === 'GET') {
    details(req, res);
  } else {
    return true;
  }
}

module.exports = {
  addMovie: (req, res) => addMovie(req, res),
  showAll: (req, res) => showAll(req, res),
  showDetails: (req, res) => showDetails(req, res)
};
