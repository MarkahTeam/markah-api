require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || '8888';
const mainRouter = require('./src/routes/index');
const server = require('http').createServer(app);
// const whiteList = ['http://localhost:3000', 'http://localhost:8888'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whiteList.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// };

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(process.env.APP_UPLOAD_ROUTE, express.static('public/images'));

server.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});

app.use('/', mainRouter);
module.exports = app;