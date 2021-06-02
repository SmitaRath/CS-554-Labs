const showRoutes = require('./shows');

const constructorMethod = (app) => {
  
app.use('/', showRoutes);
app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;