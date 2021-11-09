/* eslint-disable no-unused-vars */
const articleModel = require('../models/article.model');
const { getUserById } = require('../models/users.model');
const { response: formResponse } = require('../helpers/formResponse');
const itemImage = require('../helpers/upload');
const path = require('path');
const { APP_URL } = process.env;

exports.getArticles = async (req, res) => {
  const cond = req.query;
  cond.limit = cond.limit || 3;
  cond.offset = cond.offset || 0;
  cond.page = cond.page || 1;
  cond.offset = (cond.page - 1) * cond.limit;
  const results = await articleModel.getArticles(cond);
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
  const idUser = req.authUser.id;
  itemImage(req, res, err => {
    getUserById(idUser, (err, results) => {
      req.body.images = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
      const data = {
        id_user: idUser,
        name: req.body.name,
        images: req.body.images,
        description: req.body.description,
        detail: req.body.detail
      };
      if (!err) {
        try {
          articleModel.addArticles(data, (err, results, _fields) => {
            if (!err) {
              if (results.affectedRows > 0) {
                return formResponse(res, 200, 'Create article has been successfully!');
              } else {
                return formResponse(res, 500, 'An error occured');
              }
            } else {
              return formResponse(res, 400, `Error: ${err}`);
            }
          });
        } catch (error) {
          return formResponse(res, 400, `Error: ${error}`);
        }
      } else {
        console.log(err);
      }
    });
  });
};

exports.getDetailArticle = (req, res) => {
  const { id: stringId } = req.params;
  const id = parseInt(stringId);
  articleModel.getArticleById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        const item = results[0];
        if (item.images !== null && !item.images.startsWith('http')) {
          item.images = `${APP_URL}${item.images}`;
        }
        const data = {
          id: '',
          images: '',
          name: '',
          description: '',
          detail: '',
          id_user: '',
          username: '',
          created_at: '',
          updated_at: '',
          ...results[0]
        };
        return formResponse(res, 200, 'Detail Article', data);
      }
      else {
        return formResponse(res, 404, 'Article not Found!');
      }
    }
    else {
      return formResponse(res, 400, `${err.sqlMassege}`);
    }
  });
};

exports.updateArticle = (req, res) => {
  const { id } = req.params;
  const idUser = req.authUser.id;
  itemImage(req, res, err => {
    articleModel.getArticleById(id, (err, results, _fields) => {
      req.body.images = path.join(process.env.APP_UPLOAD_ROUTE, req.file.filename);
      const data = {
        id_user: idUser,
        name: req.body.name,
        images: req.body.images,
        description: req.body.description,
        detail: req.body.detail
      };
      if (!err) {
        if (results.length > 0) {
          articleModel.updateArticles(data, id, (err, results, _fields) => {
            if (!err) {
              return formResponse(res, 200, `Article with id ${id} updated successfully!`);
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
        return formResponse(res, 400, `${err.sqlMassege}`);
      }
    });
  });

};