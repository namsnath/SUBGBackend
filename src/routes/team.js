const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require("fs");   //For filesystem reads
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Promise = require("bluebird");

var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// Models
const User = require(path.join(__dirname, 'models', 'User'));
const Team = require(path.join(__dirname, 'models', 'Team'));
const Reward = require(path.join(__dirname, 'models', 'Reward'));
const Round1Task = require(path.join(__dirname, 'models', 'Round1Task'));
const Round2Task = require(path.join(__dirname, 'models', 'Round2Task'));



module.exports = router;