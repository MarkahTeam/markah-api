/* eslint-disable linebreak-style */
const db = require('../helpers/db');
const { promisify } = require('util');
const execPromise = promisify(db.query).bind(db);
const table = 'articles';
const tableUser = 'users';
exports.getArticles = (cond) => {
  return execPromise(`select ${table}.id, ${table}.id_user, ${table}.name, ${table}.images, ${table}.description, ${table}.detail, ${tableUser}.name AS username, ${table}.created_at from ${table} LEFT JOIN ${tableUser} ON ${table}.id_user = ${tableUser}.id ORDER BY ${table}.created_at DESC LIMIT ${cond.limit} OFFSET ${cond.offset}`, [cond.limit, cond.offset]);
};

exports.addArticles = (data, cb) => {
  db.query(`insert into ${table} (id_user,name,images,description,detail) values (?,?,?,?,?)`, [data.id_user, data.name, data.images, data.description, data.detail], cb);
};

exports.updateArticles = (data, id, cb) => {
  db.query(`update ${table} set ? where id=?`, [data, id], cb);
};

exports.deleteArticles = (id, cb) => {
  db.query(`DELETE FROM ${table} WHERE id=?`, [id], cb);
};
exports.getArticleById = (id, cb) => {
  db.query(`select ${table}.id, ${table}.id_user, ${table}.name, ${table}.images, ${table}.description, ${table}.detail, ${tableUser}.name AS username, ${table}.created_at from ${table} LEFT JOIN ${tableUser} ON ${table}.id_user = ${tableUser}.id where ${table}.id = ?`, [id], cb);
};
exports.getProductCount = () => {
  return execPromise(`select count(${table}.id) as count_item from ${table}`);
};

