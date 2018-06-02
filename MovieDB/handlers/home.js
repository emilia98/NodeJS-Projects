const fs = require('fs');
const path = require('path');
const promisify = require('../modules/promisify');

const readFile = promisify(fs.readFile);
const filePath = path.normalize('./dist/home.html');

async function showHome (req, res) {
  let html;
  try {
    html = await readFile(filePath, 'utf8');

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.write(html);
    res.end();
  } catch (err) {
    if (err) {
      console.log(err);
      res.end();
    }
  }
}

module.exports = (req, res) => {
  if (req.headers.statusheader === 'Full') {
    res.writeHead(200, {
      'Content-Type': 'application/javascript'
    });
    res.write('alert("Loading...")');
    res.end();
  } else if (req.pathname === '/' && req.method === 'GET') {
    showHome(req, res);
  } else {
    return true;
  }
};
