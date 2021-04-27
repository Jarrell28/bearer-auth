'use strict';

const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, options);

require('./src/server.js').startup(process.env.PORT);