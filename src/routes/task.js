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


function getAllOngoing() {
	return new Promise((resolve, reject) => {
		Task.aggregate([
			{ 
				$project: {
					_id: true,
					ongoingTeams: true,
					name: true,
					description: true,
					location: true,
					type: true,
				}
			},
		], function(err, data) {
			if(err)
				return reject(err);
			return resolve(data);
		});
	});
}

function findTask(params) {
	return new Promise((resolve, reject) => {
		params.type = parseInt(params.type);
		Task.aggregate([
				{ $match: { 
					ongoingTeams: { $nin: [params.teamID] },
					completedTeams: { $nin: [params.teamID] },
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
		params.type = parseInt(params.type);
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

function getSpecificOngoing(params) {
	return new Promise((resolve, reject) => {
		console.log(params);
		params.type = parseInt(params.type);
		Task.aggregate([
			{ 
				$match: { 
					ongoingTeams: params.teamID,
					location: params.location,
					type: params.type, 
				} 
			}
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
		params.type = parseInt(params.type);
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

		/*Task.find({
			type: params.type,
			location: params.location,
			name: params.name,
			ongoingTeams: params.teamID,
		}, function(err, doc) {
			console.log(doc);
		})*/
	});
}

function countCompleted(params) {
	return new Promise((resolve, reject) => {
		Task.aggregate([
			{
				$match: { completedTeams: params.teamID }	
			},
			{
				$group: {
					_id: {
						type: '$type',
						location: '$location',
					},
					count: { $sum: 1 },
				}
			},
			{
				$project: {
					count: 1,
					_id: 0,
					type: '$_id.type',
					location: '$_id.location',
					name: '$name',
					teamID: params.teamID,
				}
			}
		], function(err, data) {
			if(err)
				return reject(err);
			console.log(data);
			return resolve(data);
		});
	});
}
/*
function countUnclaimed(params) {
	return new Promise((resolve, reject) => {
		Task.aggregate([
			{
				$match: { completedTeams: params.teamID, claimedTeams: { $nin: [params.teamID] } },
			},
			{
				$group: {
					_id: {
						type: '$type',
						location: '$location',
					},
					count: { $sum: 1 },
				}
			},
			{
				$project: {
					count: 1,
					_id: 0,
					type: '$_id.type',
					location: '$_id.location',
					teamID: params.teamID,
				}
			}
		], function(err, data) {
			if(err)
				return reject(err);
			return resolve(data);
		});
	});
}
*/

/*function countPoints(params) {
	return new Promise((resolve, reject) => {
		Task.aggregate([
			{
				$match: { claimedTeams: params.teamID }
			},
			{
				$group: {
					_id: {},
					count: { $sum: '$points' }
				}
			},
		], function(err, data) {
			if(err)
				return reject(err);
			return resolve(data);
		});
	});
}*/

function newCountPoints(params) {
	return new Promise((resolve, reject) => {
		Task.aggregate([
			{
				$match: { completedTeams: params.teamID }
			},
			{
				$group: {
					_id: {
						type: '$type',
						location: '$location',
						points: '$points'
					},
					count: { $sum: 1 },
				}
			},
			{
				$project: {
					count: true,
					setCount: { $divide: [ '$count', '$_id.type' ] },
				}
			},
			{
				$project: {
					count: true,
					setCount: true,
					total: { $multiply: [ {$floor: '$setCount'}, '$_id.points', '$_id.type' ] },
				}
			},
			{
				$group: {
					_id: {/*count: '$count',
					setCount: '$setCount',
					total: '$total',*/},
					totalPoints: { $sum: '$total' },

				}
			}
		], function(err, data) {
			if(err)
				return reject(err);
			return resolve(data);
		});
	});
}
/*
function updateClaimed(params) {
	return new Promise(async (resolve, reject) => {
		var completed = await countCompleted(params);
		console.log('Completed: ', completed);
		var completedCount;
		var unclaimed = await countUnclaimed(params);
		console.log('Unclaimed', unclaimed);
		var unclaimedCount;

		if(completed.length == 0)
			completedCount = 0;
		else
			completedCount = completed[0].count

		if(unclaimed.length == 0)
			unclaimedCount = 0;
		else
			unclaimedCount = unclaimed[0].count

		var diff = completedCount - unclaimedCount;
		console.log(diff);

		//if(diff == )
		return resolve(diff);
	});
}*/

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

router.post('/getSpecificOngoing', async (req, res, next) => {
	var params = req.body;
	try {
		var data = await getSpecificOngoing(params);
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

router.post('/countCompleted', async (req, res, next) => {
	var params = req.body;
	try {
		var data = await countCompleted(params);
		res.send(data);
	} catch(err) {
		console.log(err);
	}
});
/*
router.post('/countUnclaimed', async (req, res, next) => {
	var params = req.body;
	try {
		var data = await countUnclaimed(params);
		res.send(data);
	} catch(err) {
		console.log(err);
	}
});*/
/*
router.post('/countPoints', async (req, res, next) => {
	var params = req.body;
	try {
		var data = await countPoints(params);
		res.send(data);
	} catch(err) {
		console.log(err);
	}
});
*/
router.post('/countPoints', async (req, res, next) => {
	var params = req.body;
	try {
		var data = await newCountPoints(params);
		res.send(data);
	} catch(err) {
		console.log(err);
	}
});

router.get('/getAllOngoing', async (req, res, next) => {
	try {
		var data = await getAllOngoing();
		res.send(data);
	} catch (err) {
		console.log(err);
	}
})

/*
router.post('/updateClaimed', async (req, res, next) => {
	var params = req.body;
	try {
		var data = await updateClaimed(params);
		res.send(data.toString());
	} catch(err) {
		console.log(err);
	} 
});*/
module.exports = router;