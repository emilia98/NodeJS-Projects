const homeHandler = require('./home.js');
const staticFilesHandler = require('./static-files.js');
const addMovieHandler = require('./movie.js').addMovie;
const showAllHandler = require('./movie.js').showAll;
const detailsHandler = require('./movie').showDetails;
const forbiddenHandler = require('./error').forbidden;
const notFoundHandler = require('./error').notFound;
const requestStatus = require('./status').requestStatus;

module.exports = [
  homeHandler,
  staticFilesHandler,
  addMovieHandler,
  showAllHandler,
  detailsHandler,
  requestStatus,
  forbiddenHandler,
  notFoundHandler
];
