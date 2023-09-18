const express = require('express');
const expressErr = require('./expressErr');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const itemRoutes = require('./routes/items');

app.use("/items", itemRoutes);


app.use(function (req, res, next) {
    const notFoundError = new expressErr("Not Found", 404);
    return next(notFoundError)
});

//error handler
app.use(function (err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;


    return res.status(status).json({
        error: { message, status }
    });
});


module.exports = app;