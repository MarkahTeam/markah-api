/* eslint-disable quotes */
const db = require('../helpers/db');
const { promisify } = require('util');
const table = 'users';
const execPromise = promisify(db.query).bind(db);

exports.createUser = (data) => {
  return execPromise(`insert into ${table} (name, email, password, role) values (?, ?, ?, 'writer')`, [data.name, data.email, data.password, data.role]);
};

exports.getUserByEmail = (email) => {
  return execPromise(`Select id, email, password, role from ${table} where email = ?`, email);
};

exports.getUserById = (id, cb) => {
  db.query(`
    SELECT id, role, name, email FROM users WHERE id = ?
    `, [id], cb);
};