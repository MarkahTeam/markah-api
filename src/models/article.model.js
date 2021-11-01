/* eslint-disable linebreak-style */
const db = require('../helpers/db');
const { promisify } = require('util');
const execPromise = promisify(db.query).bind(db);
const table = 'articles';
exports.getArticles = (cond) => {
  return execPromise(`select ${table}.id, ${table}.name, ${table}.images, ${table}.price, ${table}.description, ${table}.created_at from ${table} ORDER BY ${table}.created_at DESC LIMIT ${cond.limit} OFFSET ${cond.offset}`, [cond.limit, cond.offset]);
};

exports.addArticles = (data, cb) => {
  db.query(`insert into ${table} (name,images,price,description) values (?,?,?,?)`, [data.name, data.images, data.price, data.description], cb);
};

exports.updateArticles = (data, id, cb) => {
  db.query(`update ${table} set ? where id=?`, [data, id], cb);
};

exports.deleteArticles = (id, cb) => {
  db.query(`DELETE FROM ${table} WHERE id=?`, [id], cb);
};
