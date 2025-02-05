const express = require("express");
const router = express.Router();
const { getLandingPage } = require("../controllers/index");

// Import the models
// const Model_1 = require('../models/Model_1');
// const Model_2 = require('../models/Model_2');

// GET index page
router.get("/", getLandingPage);

// Use the backpacks router with the /backpacks prefix
router.use("/backpack", require("./backpack"));

module.exports = router;
