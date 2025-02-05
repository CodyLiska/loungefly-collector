const express = require("express");
const router = express.Router();
const {
  getLandingPage,
  getAddPage,
  getCollectionPage,
  getSearchPage,
} = require("../controllers/backpacks");

// Import the models
// const Model_1 = require('../models/Model_1');
// const Model_2 = require('../models/Model_2');

// GET landing page
router.get("/", getLandingPage);
// GET Add page
router.get("/add", getAddPage);
// GET Collection page
router.get("/collection", getCollectionPage);
// GET Search page
router.get("/search", getSearchPage);

module.exports = router;
