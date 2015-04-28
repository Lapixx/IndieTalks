// dependencies
var fs = require("fs");
var express = require("express");
var serveStatic = require("serve-static");
var Handlebars = require("handlebars");

// handlebars templates
var video = fs.readFileSync("./templates/video.html", {encoding: "UTF8"});
var video_template = Handlebars.compile(video);
var list = fs.readFileSync("./templates/list.html", {encoding: "UTF8"});
var list_template = Handlebars.compile(list);

// load the video info
var routes = require("./routes").reverse();

// initialise the server
var app = express();

// log requests for debuging
app.use(function (req, res, next) {
    console.log(req.method, req.headers.host, req.url);
    next();
});

// bind the video info to the template
function makeVideoGetter(talk) {

  var html = video_template(talk);

  return function (req, res) {
      res.send(html);
      res.end();
  }
}

// convert titles to valid url slugs
function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g,'-')
    .replace(/[^\w-]+/g,'');
}

// loop over the available videos
for (var i = 0; i < routes.length; i++) {

  if (routes[i].slug === undefined)
    routes[i].slug = makeSlug(routes[i].title);

  // add the route for the video
  app.get("/" + routes[i].slug, makeVideoGetter(routes[i]));
}

// generate homepage html
var html = list_template({talks: routes});
app.get("/", function (req, res) {

  res.send(html);
  res.end();
});

// serve static assets
app.use(serveStatic("static"));

// start listening
var PORT = 8000;
app.listen(PORT, function (err) {
	
    if (err) console.error(err);
    else     console.log("Server listening at", PORT);
});

// and export app just in case
module.exports = app;
