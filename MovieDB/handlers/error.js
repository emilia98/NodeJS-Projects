const fs = require('fs');
const path = require('path');
const promisify = require('../modules/promisify');

const readFile = promisify(fs.readFile);

const forbiddenPath = path.normalize(
  path.join(__dirname, '../', '/dist/forbidden.html')
);
const notFoundPath = path.normalize(
  path.join(__dirname, '../', '/dist/page404.html')
);

async function forbid (res) {
  let html = await readFile(forbiddenPath, 'utf8');

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  res.end(html);
}

async function showError (res) {
  try {
    let html = await readFile(notFoundPath, 'utf8');
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(html);
  } catch (err) {
    console.log(err);
    res.end();
  }
}

function forbidden (req, res) {
  if (req.pathname === '/forbidden') {
    forbid(res);
  } else {
    return true;
  }
}

function notFound (req, res) {
  showError(res);
}

module.exports = {
  forbidden: (req, res) => forbidden(req, res),
  notFound: (req, res) => notFound(req, res)
};
