'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const express = require('express');
const path = require('path');

const routes = require('./routes');

const app = express();

if (process.env.ENVIRONMENT == 'development') {
    app.use(errorhandler());
}

app.use(cors());
app.use(bodyParser.raw({ type: 'application/jwt' }));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

app.listen(process.env.PORT || 3000);