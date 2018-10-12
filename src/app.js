const express = require("express");
const path = require('path');
const fs = require("fs");	//For filesystem reads
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Promise = require("bluebird");

const app = express();
const port = 3000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/SUBG", { useNewUrlParser: true });
const db = mongoose.connection;

// Models
const User = require(path.join(__dirname, 'models', 'User'));
const Team = require(path.join(__dirname, 'models', 'Team'));
const Reward = require(path.join(__dirname, 'models', 'Reward'));
const TeamReward = require(path.join(__dirname, 'models', 'TeamReward'));
const TeamTask = require(path.join(__dirname, 'models', 'TeamTask'));
const Task = require(path.join(__dirname, 'models', 'Task'));
const Code = require(path.join(__dirname, 'models', 'Code'));
const Round = require(path.join(__dirname, 'models', 'Round'));


// Route Init
const user = require(path.join(__dirname, 'routes', 'user'));
const team = require(path.join(__dirname, 'routes', 'team'));
const task = require(path.join(__dirname, 'routes', 'task'));



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.use('/user', user);
app.use('/team', team);
app.use('/task', task);

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

app.get('/roundData', async(req, res, next) => {
	Round.find({}, function(err, data) {
		if(err)
			res.send(err);
		res.send(data[0]);
	});
});

function teamRemove() {
	return new Promise((resolve, reject) => {
		Team.deleteMany({}, function(err, resp) {
			if(err)
				return reject(err);
			return resolve(resp);
		});
	});
}

function userUnregister() {
	return new Promise((resolve, reject) => {
		User.update({registered: true}, {registered: false}, {multi: true}, function(err, doc) {
			if(err)
				return reject(err);
			return resolve(doc);
		})
	});
}

function taskClear() {
	return new Promise((resolve, reject) => {
		Task.update({}, {ongoingTeams: [], completedTeams: []}, {multi: true}, function(err, doc) {
			if(err)
				return reject(err);
			return resolve(doc);
		})
	});
}

app.post('/unregister', async(req, res, next) => {
	try {
		await userUnregister();
		await teamRemove();
		await taskClear();
		res.send('Done');
	} catch(err) {
		res.send(err);
	}
});

app.post('/addAll', async (req, res, next) => {
	var params = req.body;
	console.log(req.body);
	await User.deleteMany({});
	User.insertMany(params, function(err, data) {
		console.log(err);
		res.send('Done');
	});
});

app.get('/', async(req, res, next) => {
	return res.sendFile(path.join(__dirname,'..','..','SUBGFrontendCSI',"index.html"));
});
