const http = require('http');
const url = require('url');
const port = 8080;
const handlers = require('./handlers');

http.createServer((req, res) => {
  req.pathname = url.parse(req.url).pathname;

  for (let handler of handlers) {
    if (!handler(req, res)) {
      return;
    }
  }
}).listen(port);

console.log(`The server is listening on port ${port}...`);
