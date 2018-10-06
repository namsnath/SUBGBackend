const express = require("express");
const path = require('path');
const fs = require("fs");	//For filesystem reads
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Promise = require("bluebird");

const app = express();
const port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/SUBG");
const db = mongoose.connection;

// Models


// Route Init
const user = require(path.join(__dirname, 'routes', 'user'));
const team = require(path.join(__dirname, 'routes', 'team'));


// Routes
app.use('/user', user);
app.use('/team', team);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB Instance");
});


//Error Handler
app.use(function (err, req, res, next) {
  	if(err.status = 400)
  	{
  		console.log(err);
  		res.send(err);
  	}
  	else
  		res.sendStatus(err.status)
});

app.listen(port, () => {
	console.log("Server listening on port " + port)
});