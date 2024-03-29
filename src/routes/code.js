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


function getClassicChallenges() {
	return new Promise((resolve, reject) => {
		Code.aggregate([
			{
				$match: {
					type: "Classic",
				}
			}
		], function(err, data) {
			if(err)
				return reject(err);
			return resolve(data);
		});
	});
}

function getWarChallenges() {
	return new Promise((resolve, reject) => {
		Code.aggregate([
			{
				$match: {
					type: "War",
				}
			}
		], function(err, data) {
			if(err)
				return reject(err);
			return resolve(data);
		});
	});
}

router.get('/getClassicChallenges', async (req, res, next) => {
	try {
		var data = await getClassicChallenges();
		res.send(data);
	} catch (err) {
		console.log(err);
	}
});

router.get('/getWarChallenges', async (req, res, next) => {
	try {
		var data = await getWarChallenges();
		res.send(data);
	} catch (err) {
		console.log(err);
	}
});

router.get('/getAllChallenges', async (req, res, next) => {
	try {

	} catch(err) {
		console.log(err);
	}
});


module.exports = router;