const express = require('express');
const classRouter = express.Router();
const classController = require('../controllers/class.controller');
const admin = require('../middleware/checkToken');

classRouter.get('/', classController.getClass);
classRouter.post('/', classController.addClass);
classRouter.get('/:id', classController.getDetailItem);
classRouter.put('/:id', admin, classController.updateClass);


module.exports = classRouter;