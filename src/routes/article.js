const express = require('express');
const articleRouter = express.Router();
const articleController = require('../controllers/article.controller');
const writer = require('../middleware/checkTokenWriter');

articleRouter.get('/', articleController.getArticles);
articleRouter.post('/', writer, articleController.addArticle);
articleRouter.put('/:id', writer, articleController.updateArticle);
articleRouter.get('/:id', articleController.getDetailArticle);


module.exports = articleRouter;