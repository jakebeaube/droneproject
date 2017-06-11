var express = require("express"),
    xAdmin = require('express-admin');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
// Requiring our models for syncing
var db = require("./models");

var PORT = 3000;

var app = express();

// Serve static content for the app from the "public" directory in the application directory.

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
var exphbs = require("express-handlebars");

var config = {
    dpath: './express-admin-config/',
    config: require('./express-admin-config/config.json'),
    settings: require('./express-admin-config/settings.json'),
    custom: require('./express-admin-config/custom.json'),
    users: require('./express-admin-config/users.json')
};

xAdmin.init(config, function (err, admin) {
    if (err) return console.log(err);
    // mount express-admin before any other middlewares
    app.use('/admin', admin);
    // site specific middlewares
    app.use(express.static(process.cwd() + "/public"));
    app.use(bodyParser.urlencoded({ extended: false }));

    // app.use(express.bodyParser());
    // site routes
    app.get('/', function (req, res) {
        res.send('Hello World');
    });
    // site server
    db.sequelize.sync({}).then(function() {
      app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
      });
    });
});

// uncomment when handlebars are made ----
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");
//
// Import routes and give the server access to them.
// var routes = require("./controllers/burger_controller.js");

// app.use("/", routes);

// possibly use this code INSIDE xadmin.config ----
// Syncing our sequelize models and then starting our express app
// db.sequelize.sync({}).then(function() {
//   app.listen(PORT, function() {
//     console.log("App listening on PORT " + PORT);
//   });
// });
