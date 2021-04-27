'use strict';

const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, options);

require('./src/server.js').start(process.env.PORT);