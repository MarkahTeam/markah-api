const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/users.controller');

userRouter.post('/register', userController.signup);
userRouter.post('/login', userController.login);
// authRouter.post('/forgot-password', authController.forgotPassword); 

module.exports = userRouter;