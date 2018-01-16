const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const controllers = require('./controllers');
const app = express();

// Устанавливаем каким шаблонизатором будем обрабатывать страницы и где шаблоны
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

app.get('/', controllers.index);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.listen(80, function () { console.log('Express app listening on localhost:80'); });