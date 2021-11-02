/* eslint-disable no-unused-vars */
const classModel = require('../models/class.model');
const { response: formResponse } = require('../helpers/formResponse');
const { validateInteger } = require('../helpers/validation');
const itemImage = require('../helpers/upload');
const path = require('path');
const { APP_URL } = process.env;

exports.getClass = async (req, res) => {
  const cond = req.query;
  cond.limit = cond.limit || 3;
  cond.offset = cond.offset || 0;
  cond.page = cond.page || 1;
  cond.offset = (cond.page - 1) * cond.limit;
  const results = await classModel.getClasses(cond);
  const countResult = await classModel.getProductCount();
  const pageInfo = {};
  try {
    const totalItems = countResult[0].count_item;
    const lastPage = Math.ceil(totalItems / cond.limit);
    pageInfo.totalItems = totalItems;
    pageInfo.currentPage = cond.page;
    pageInfo.lastPage = lastPage;
    pageInfo.limitData = cond.limit;
    pageInfo.nextPage =
      cond.page < lastPage
        ? `${APP_URL}/class?page=${cond.page + 1}`
        : null;
    pageInfo.prevPage =
      cond.page > 1
        ? `${APP_URL}/class?page=${cond.page - 1}`
        : null;
    return formResponse(res, 200, 'List of class', results, pageInfo);
  } catch (error) {
    return formResponse(res, 500, 'An error occured!', error);
  }
};

exports.addClass = (req, res) => {
  itemImage(req, res, err => {
    validateInteger(res, req.body.price, 'Price', () => {
      req.body.images = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
      try {
        classModel.addClass(req.body, (err, results, _fields) => {
          if (!err) {
            if (results.affectedRows > 0) {
              return formResponse(res, 200, 'Create item has been successfully!');
            } else {
              return formResponse(res, 500, 'An error occured');
            }
          } else {
            return formResponse(res, 400, `Error: ${err.sqlMassege}`);
          }
        });
      } catch (error) {
        return formResponse(res, 400, `Error: ${error.sqlMassege}`, error);
      }
    });
  });
};

exports.updateClass = (req, res) => {
  const { id } = req.params;
  itemImage(req, res, err => {
    req.body.images = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
    classModel.getClassById(id, (err, results, _fields) => {
      if (!err) {
        if (results.length > 0) {
          const data = req.body;
          classModel.updateClass(req.body, id, (err, results, _fields) => {
            if (!err) {
              return formResponse(res, 200, `item with id ${id} updated successfully!`);
            }
            else {
              console.error(err);
              return formResponse(res, 500, 'An error occured');
            }
          });
        }
        else {
          return formResponse(res, 404, 'Item not found!');
        }
      }
      else {
        return formResponse(res, 400, `Error: ${err.sqlMassege}`);
      }
    });
  });

};

exports.getDetailItem = (req, res) => {
  const { id: stringId } = req.params;
  const id = parseInt(stringId);
  classModel.getClassById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        const item = results[0];
        if (item.images !== null && !item.images.startsWith('http')) {
          item.images = `${APP_URL}${item.images}`;
        }
        return formResponse(res, 200, 'Detail Item', results);
      }
      else {
        return formResponse(res, 404, 'Item not Found!');
      }
    }
    else {
      return formResponse(res, 400, `Error: ${err.sqlMassege}`);
    }
  });
};

