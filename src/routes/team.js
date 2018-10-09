const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require("fs");   //For filesystem reads
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Promise = require("bluebird");

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// Models
const User = require(path.join(__dirname, '..', 'models', 'User'));
const Team = require(path.join(__dirname, '..', 'models', 'Team'));
const Reward = require(path.join(__dirname, '..', 'models', 'Reward'));
const TeamReward = require(path.join(__dirname, '..', 'models', 'TeamReward'));
const TeamTask = require(path.join(__dirname, '..', 'models', 'TeamTask'));
const Task = require(path.join(__dirname, '..', 'models', 'Task'));
const Code = require(path.join(__dirname, '..', 'models', 'Code'));


function findUser(params) {
	return new Promise((resolve, reject) => {
		console.log(params);
		User.findOne({name: params.name, gravitasID: params.gravitasID},
			function(err, doc) {
				if(err)
					return reject(err);
				if(doc == null)
					return reject('User ' + params + 'Not Found');
				return resolve(true);
			});
	});
}

function registerUser(params) {
	return new Promise((resolve, reject) => {
		User.updateOne({name: params.name, gravitasID: params.gravitasID},
			{registered: true},
			function(err) {
				if(err)
					return reject(err);
			});
	});
}

function registerTeam(params) {
	return new Promise((resolve, reject) => {
		var data;
		if(params.user3Present)
			data = {
				memberID1: params.gravitasID1,
				memberID2: params.gravitasID2,
				memberID3: params.gravitasID3,
			};
		else
			data = {
				memberID1: params.gravitasID1,
				memberID2: params.gravitasID2,
			};


		Team.updateOne(data, data, {upsert: true, new: true}, 
			function(err, doc) {
				if(err) 
					return reject(err);
				if(!doc) 
					return reject("Team not found");

				return resolve(doc.upserted[0]._id);
			});
	});
}

function findTeam(params) {
	return new Promise((resolve, reject) => {
		var data;
		if(params.user3Present)
			data = {
				memberID1: params.gravitasID1,
				memberID2: params.gravitasID2,
				memberID3: params.gravitasID3,
			};
		else
			data = {
				memberID1: params.gravitasID1,
				memberID2: params.gravitasID2,
			};

		Team.findOne(data, function(err, doc) {
			if(err)
				return reject(err);
			if(!doc)
				return reject("Team not found");

			return resolve(doc);
		})	

	});
}


/*
*	Request:
*	name1: String
*	gravitasID1: String
*	name2: String
*	gravitasID2: String
*	name3: String
*	gravitasID3: String
*/
router.post('/findTeam', async (req, res, next) => {
	var params = req.body;
	var user3Present = false;
	var user1Found, user2Found, user3Found
	var teamID;
	
	var user1 = {name: params.name1, gravitasID: params.gravitasID1};
	var user2 = {name: params.name2, gravitasID: params.gravitasID2};
	if(params.name3 && params.gravitasID3 && params.name3 !== "" && params.gravitasID3 !== "") {
		var user3 = {name: params.name3, gravitasID: params.gravitasID3};
		user3Present = true;
		params.user3Present = user3Present;
	}
	console.log(user3Present);

	var team = await findTeam({memberID1: params.gravitasID1, memberID2: params.gravitasID2});
	res.send(team);
});

/*
*	Request:
*	name1: String
*	gravitasID1: String
*	name2: String
*	gravitasID2: String
*	name3: String
*	gravitasID3: String
*/
router.post('/registerTeam', async (req, res, next) => {
	var params = req.body;
	var user3Present = false;
	var user1Found, user2Found, user3Found
	var teamID;
	
	var user1 = {name: params.name1, gravitasID: params.gravitasID1};
	var user2 = {name: params.name2, gravitasID: params.gravitasID2};
	if(params.name3 && params.gravitasID3 && params.name3 !== "" && params.gravitasID3 !== "") {
		var user3 = {name: params.name3, gravitasID: params.gravitasID3};
		user3Present = true;
		params.user3Present = user3Present;
	}
	console.log(user3Present);
	
	user1Found = await findUser(user1);
	user2Found = await findUser(user2);
	if(user3Present)
		user3Found = await findUser(user3);
	else
		user3Found = true


	console.log(user1Found, user2Found, user3Found);
	if(user1Found && user2Found && user3Found) {
		teamID = await registerTeam(params);
		registerUser(user1);
		registerUser(user2);

		if(user3Present)
			registerUser(user3);

		res.send(teamID);
	} else 
		res.send("User not Found");
});


router.post('', async (req, res, next) => {
	
});
module.exports = router;