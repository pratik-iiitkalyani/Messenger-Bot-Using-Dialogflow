require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(1338, () => console.log('Express server is listening on port 1338'));

const verifyWebhook = require('./verify-webhook');

    app.get('/', verifyWebhook);

const messageWebhook = require('./message-webhook');

    app.post('/', messageWebhook);