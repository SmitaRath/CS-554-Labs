const path = require('path');

const constructorMethod = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve('static/movies.html'));
  });

  app.use('*', (req, res) => {
    res.status(404);
    res.sendFile(path.resolve('static/error.html'));
  });
};

module.exports = constructorMethod;