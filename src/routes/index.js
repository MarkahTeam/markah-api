const express = require('express');
const classRouter = require('./class');
const userRouter = require('./users');
const mainRouter = express.Router();
const { APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env;
const welcomeRouter = require('./welcome');
// endpoint handler
mainRouter.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH));

mainRouter.use('/', welcomeRouter);
mainRouter.use('/class', classRouter);
mainRouter.use('/user', userRouter);

module.exports = mainRouter;