/* eslint-disable no-unused-vars */
const articleModel = require('../models/article.model');
const { response: formResponse } = require('../helpers/formResponse');
const { validateInteger } = require('../helpers/validation');
const itemImage = require('../helpers/upload');
const path = require('path');
const { APP_URL } = process.env;

exports.getArticles = async (req, res) => {
  const cond = req.query;
  cond.limit = cond.limit || 3;
  cond.offset = cond.offset || 0;
  cond.page = cond.page || 1;
  cond.offset = (cond.page - 1) * cond.limit;
  const results = await articleModel.getClasses(cond);
  const countResult = await articleModel.getProductCount();
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
        ? `${APP_URL}/article?page=${cond.page + 1}`
        : null;
    pageInfo.prevPage =
      cond.page > 1
        ? `${APP_URL}/article?page=${cond.page - 1}`
        : null;
    return formResponse(res, 200, 'List of articles', results, pageInfo);
  } catch (error) {
    return formResponse(res, 500, 'An error occured!', error);
  }
};

exports.addArticle = (req, res) => {
  itemImage(req, res, err => {
    validateInteger(res, req.body.price, 'Price', () => {
      req.body.images = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
      try {
        articleModel.addClass(req.body, (err, results, _fields) => {
          if (!err) {
            if (results.affectedRows > 0) {
              return formResponse(res, 200, 'Create article has been successfully!');
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

exports.updateArticle = (req, res) => {
  const { id } = req.params;
  articleModel.getClassById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        const data = req.body;
        articleModel.updateItem(data, id, (err, results, _fields) => {
          if (!err) {
            return formResponse(res, 200, `article with id ${id} updated successfully!`);
          }
          else {
            console.error(err);
            return formResponse(res, 500, 'An error occured');
          }
        });
      }
      else {
        return formResponse(res, 404, 'Article not found!');
      }
    }
    else {
      return formResponse(res, 400, `Error: ${err.sqlMassege}`);
    }
  });
};