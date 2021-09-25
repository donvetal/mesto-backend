const express = require('express');
const mongoose = require('mongoose');
const {PORT = 3000} = process.env;
const bodyParser = require('body-parser');
const {login} = require('./controllers/user');
const {createUser} = require('./controllers/user');
const auth = require('./middlewares/auth');

const app = express();
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({extended: true})); // для приёма веб-страниц внутри POST-запроса

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use((req, res) => {
  res.status(404).send({message: 'Извините, страница не найдена!'});
});
app.use((err,
         req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const {statusCode = 500, message} = err;
  // проверяем статус и выставляем сообщение в зависимости от него
  res.status(statusCode).send({message: statusCode === 500 ? 'На сервере произошла ошибка' : message});
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
