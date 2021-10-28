const express = require('express');
const welcomeRouter = express.Router();

welcomeRouter.get('/', (req, res) => {
  res.send('Welcome to Markah API');
});

module.exports = welcomeRouter;