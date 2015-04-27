// dependencies
var connect = require("connect");
var serveStatic = require("serve-static");

var app = connect();

app.use(function (req, res, next) {
    console.log(req.method, req.headers.host, req.url);
    next();
});

app.use(serveStatic("static"));

// start listening
app.listen(8000);

module.exports = app;
