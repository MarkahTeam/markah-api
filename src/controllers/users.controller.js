/* eslint-disable no-undef */
const userModel = require('../models/users.model');
const { response } = require('../helpers/formResponse');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { APP_SECRET_KEY } = process.env;
const regex = require('../helpers/validation');
console.log(APP_SECRET_KEY);

exports.signup = async (req, res) => {
  const data = req.body;
  const checkEmail = await userModel.getUserByEmail(data.email);
  if (checkEmail.length > 0) {
    return response(res, 401, 'Email already exist!');
  }
  if (regex.validateEmail(data.email)) {
    const saltRounds = await bycrpt.genSalt(10);
    data.password = await bycrpt.hash(data.password, saltRounds);
    await userModel.createUser(data);
    return response(res, 200, 'Create user has been successfully!', data);
  } else {
    return response(res, 401, 'Email is not valid!');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const checkEmail = await userModel.getUserByEmail(email);
  try {
    if (checkEmail.length < 1) {
      return response(res, 404, 'email not found!');
    }
    const user = checkEmail[0];
    console.log('data user: ', user);
    const compare = await bycrpt.compare(password, user.password);
    if (user.role === 'admin') {
      if (compare) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, APP_SECRET_KEY, { expiresIn: '1h' });
        return response(res, 200, 'Login Admin Success!', { token });
      } else {
        return response(res, 401, 'Wrong email or password!');
      }
    }
    if (user.role === 'writer') {
      if (compare) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, APP_SECRET_KEY, { expiresIn: '1h' });
        return response(res, 200, 'Login Success!', { token });
      } else {
        return response(res, 401, 'Wrong email or password!');
      }
    }
  } catch (error) {
    console.log('why error: ', error);
  }


};