function promisify (func) {
  return (...params) => {
    return new Promise((resolve, reject) => {
      func(...params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  };
}

module.exports = promisify;
