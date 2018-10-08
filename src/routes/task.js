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
		//var params = req.body;
		//type, location, team
		Task.aggregate([
				{ $match: { 
					teams: { $nin: [params.teamID] },
					type: params.type,
					location: params.location, 
				} },
				{ $sample: { size: 1 } }
			], function(err, data) {
				if(err)
					return reject(err);
				params.reqTask = data[0];
				return resolve(params);
		});
	});
}

function assignTask(params) {
	return new Promise((resolve, reject) => {
		Task.updateOne({
			type: params.reqTask.type,
			location: params.reqTask.location,
			name: params.reqTask.name,
		}, { $push: { teams: params.teamID } }, 
		function(err, data) {
			if(err)
				return reject(err);
			console.log(data);
			return resolve(params);
		});
		/*console.log(params);
		Task.findOne({
			type: params.reqTask[0].type,
			location: params.reqTask[0].location,
			name: params.reqTask[0].name,
		}, function(err, data) {
			console.log(data);
		});*/
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
		var data = await findTask(params)
		var data2 = await assignTask(data);
		res.send(data2);
	} catch(err) {
		console.log(err);
	}
});

module.exports = router;