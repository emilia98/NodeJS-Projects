const fs = require('fs');
const path = require('path');
const promisify = require('../modules/promisify');

const readFile = promisify(fs.readFile);

const filePath = path.normalize(
  path.join(__dirname, '../dist/status.html')
);
const dbPath = path.normalize(
  path.join(__dirname, '../config/movies.json')
);

async function respond (res) {
  let html;
  try {
    html = await readFile(filePath, 'utf8');
  } catch (err) {
    console.log(err);
    res.end();
  }

  let database = await readFile(dbPath, 'utf8');
  let moviesCount = 0;
  let json;

  try {
    json = JSON.parse(database);
    moviesCount = json.length;
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }

  html = html.replace(
    '{{replaceMe}}',
    `Total movies count: ${moviesCount}`);

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  res.write(html);
  res.end();
}

function requestStatus (req, res) {

  if (req.pathname === '/status') {
    respond(res);
  } else {
    return true;
  }
}

module.exports = {
  requestStatus: (req, res) => requestStatus(req, res)
};
