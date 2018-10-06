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
const User = require(path.join(__dirname, 'models', 'User'));
const Team = require(path.join(__dirname, 'models', 'Team'));
const Reward = require(path.join(__dirname, 'models', 'Reward'));
const TeamReward = require(path.join(__dirname, 'models', 'TeamReward'));
const TeamTask = require(path.join(__dirname, 'models', 'TeamTask'));
const Task = require(path.join(__dirname, 'models', 'Task'));
const Code = require(path.join(__dirname, 'models', 'Code'));


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