const express = require('express');
const mainRouter = express.Router();
const { APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env;
const welcomeRouter = require('./welcome');
// endpoint handler
mainRouter.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH));

mainRouter.use('/', welcomeRouter);


module.exports = mainRouter;