'use strict';

module.exports = (req, res, next) => {
    let error = { error: 'Resource Not Found' };
    res.statusCode = 400;
    res.statusMessage = "Not Found";
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(error));
    res.end();
}