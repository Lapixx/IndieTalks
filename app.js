// dependencies
var fs = require("fs");
var express = require("express");
var serveStatic = require("serve-static");
var Handlebars = require("handlebars");

var video = fs.readFileSync("./video.html", {encoding: "UTF8"});
var video_template = Handlebars.compile(video);
var list = fs.readFileSync("./list.html", {encoding: "UTF8"});
var list_template = Handlebars.compile(list);

var routes = require("./routes").reverse();

var app = express();

app.use(function (req, res, next) {
    console.log(req.method, req.headers.host, req.url);
    next();
});

function makeVideoGetter(talk) {

  var html = video_template(talk);

  return function (req, res) {
      res.send(html);
      res.end();
  }
}

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g,'-')
    .replace(/[^\w-]+/g,'');
}


for (var i = 0; i < routes.length; i++) {

  if (routes[i].slug === undefined)
    routes[i].slug = makeSlug(routes[i].title);

  app.get("/" + routes[i].slug, makeVideoGetter(routes[i]));
}

var html = list_template({talks: routes});
app.get("/", function (req, res) {

  res.send(html);
  res.end();
});

// static assets
app.use(serveStatic("static"));

// start listening
app.listen(8000);

module.exports = app;
