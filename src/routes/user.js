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


router.get("/getNotRegistered", (req, res, next) => {
	User.aggregate([
    		{ $match: {registered: false} },
    		{ $project: {gravitasID: 1, name: 1, _id: 0} },
    		{ $sort: {gravitasID: 1} },
    	], function(err, data) {
    		if(err)
    			res.send(err);
    		res.send(data);
    	});
});

router.get('/getAll', (req, res, next) => {
    User.aggregate([
            { $project: {gravitasID: 1, name: 1, _id: 0} },
            { $sort: {gravitasID: 1} },
        ], function(err, data) {
            if(err)
                res.send(err);
            res.send(data);
        });
});

router.post('/addUser', (req, res, next) => {
    var params = req.body;
    var user = new User(params);
    user.save(function(err, results) {
        console.log(results);
    });
    /*
    User.update(params, params, {upsert: true, new: true},
        function(err, doc) {
            console.log(doc);
        });*/
});


module.exports = router;