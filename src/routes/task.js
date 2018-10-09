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



function findTask(params) {
	return new Promise((resolve, reject) => {
		Task.aggregate([
				{ $match: { 
					ongoingTeams: { $nin: [params.teamID] },
					type: params.type,
					location: params.location, 
				} },
				{ $sample: { size: parseInt(params.type) } }
			], function(err, data) {
				if(err)
					return reject(err);
				params.reqTask = data;
				return resolve(params);
		});
	});
}

function assignTask(params) {
	return new Promise((resolve, reject) => {
		Task.updateOne({
			type: params.type,
			location: params.location,
			name: params.name,
		}, { $push: { ongoingTeams: params.teamID } }, 
		function(err, data) {
			if(err)
				return reject(err);
			console.log(data);
			return resolve(params);
		});
	});
}

function getOngoing(params) {
	return new Promise((resolve, reject) => {
		Task.aggregate([
			{ $match: { ongoingTeams: params.teamID } }
		], function(err, data) {
			if(err)
				return reject(err);
			return resolve(data);
		});
	});
}

function getCompleted(params) {
	return new Promise((resolve, reject) => {
		Task.aggregate([
			{ $match: { completedTeams: params.teamID } }
		], function(err, data) {
			if(err)
				return reject(err);
			return resolve(data);
		});
	});
}

function completeTask(params) {
	return new Promise((resolve, reject) => {
		Task.updateOne(
			{
				type: params.type,
				location: params.location,
				name: params.name,
				ongoingTeams: params.teamID,
			},
			{
				$pull: { ongoingTeams: params.teamID },
				$push: { completedTeams: params.teamID },
			}, function(err, data) {
				if(err)
					return reject(err);
				console.log(data);
				return resolve(params);
			}
		);
	});
}

/*
*	Ayush was here
*	name
*	type
*	location
*	description
*/
router.post('/addTask', async (req, res, next) => {
	var params = req.body;
	var task = new Task(params);
    task.save(function(err, results) {
        console.log(results);
    });
});

router.post('/assignTask', async (req, res, next) => {
	var params = req.body;
	
	try {
		var data = await findTask(params);
		//console.log(data);
		if(data == [])
			res.send('Task Not Available')
		else
			data.reqTask.forEach(async (dat) => {
				dat.teamID = params.teamID;
				//console.log(dat);
				var data2 = await assignTask(dat);	
			});
			
		res.send(data);
	} catch(err) {
		console.log(err);
	}
});


router.post('/getOngoing', async (req, res, next) => {
	var params = req.body;
	try {
		var data = await getOngoing(params);
		res.send(data);
	} catch(err) {
		console.log(err);
	}
});

router.post('/getCompleted', async (req, res, next) => {
	var params = req.body;
	try {
		var data = await getCompleted(params);
		res.send(data);
	} catch(err) {
		console.log(err);
	}
});

router.post('/completeTask', async (req, res, next) => {
	var params = req.body;
	try {
		await completeTask(params);
		res.send(params);
	} catch(err) {
		console.log(err);
	}
});

module.exports = router;