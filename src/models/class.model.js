/* eslint-disable linebreak-style */
const db = require('../helpers/db');
const { promisify } = require('util');
const execPromise = promisify(db.query).bind(db);
const table = 'class';
exports.getClasses = (cond) => {
  return execPromise(`select ${table}.id, ${table}.name, ${table}.images, ${table}.price, ${table}.description, ${table}.detail, ${table}.created_at from ${table} ORDER BY ${table}.created_at DESC LIMIT ${cond.limit} OFFSET ${cond.offset}`, [cond.limit, cond.offset]);
};

exports.addClass = (data, cb) => {
  db.query(`insert into ${table} (name,images,price,description,detail) values (?,?,?,?,?)`, [data.name, data.images, data.price, data.description, data.detail], cb);
};

exports.updateClass = (data, id, cb) => {
  db.query(`update ${table} set ? where id=?`, [data, id], cb);
};

exports.deleteClass = (id, cb) => {
  db.query(`DELETE FROM ${table} WHERE id=?`, [id], cb);
};
exports.getClassById = (id, cb) => {
  db.query(`SELECT ${table}.id, ${table}.images, ${table}.name, ${table}.price, ${table}.description, ${table}.detail, ${table}.created_at, ${table}.updated_at from ${table} where ${table}.id = ?`, [id], cb);
};
exports.getProductCount = () => {
  return execPromise(`select count(${table}.id) as count_item from ${table}`);
};