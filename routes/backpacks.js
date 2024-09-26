const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const {
  getAddPage,
  addUserCreatedBackpack,
  getUsersCollectionPage,
  getUsersCollectionById,
  getSingleBackpackById,
  editBackpack,
  updateBackpack,
  deleteBackpack,
  getSearchPage,
  addBackpackFromDatabase,
} = require("../controllers/backpackController");

const Backpack = require("../models/Backpack");
const User = require("../models/User");

// @desc    Show the add.hbs page
// @route   GET /backpacks/add
router.get("/add", ensureAuth, getAddPage);

// @desc    Process the add form
// @route   POST /backpacks/addToUserCollection
router.post("/addToUserCollection", ensureAuth, addUserCreatedBackpack);

// // @desc    Show user's backpack collection page
// // @route   GET /backpacks
router.get("/", ensureAuth, getUsersCollectionPage);

// @desc    Shows backpack collection by User Id (**NOT BEING USED**)
// @route   GET /backpacks/user/:id (only show the stories of the user in the URL)
router.get("/user/:userId", ensureAuth, getUsersCollectionById);

// @desc    Show a single backpack by id
// @route   GET /backpacks/:id
router.get("/show/:id", ensureAuth, getSingleBackpackById);

// @desc    Edit a backpack by id
// @route   GET /backpacks/edit/:id
router.get("/edit/:id", ensureAuth, editBackpack);

// @desc    Update a backpack by id
// @route   PUT /backpacks/:id
router.put("/:id", ensureAuth, updateBackpack);

// @desc    Delete a backpack by id
// @route   DELETE /backpacks/:id
router.delete("/:id", ensureAuth, deleteBackpack);

// @desc    Show the search page
// @route   GET /backpacks/search/:query
router.get("/search/:query", ensureAuth, getSearchPage);

// @desc    Add a backpack to users collection array
// @route   POST /backpacks/addToCollection/:id
router.post("/addToCollection/:id", ensureAuth, addBackpackFromDatabase);

module.exports = router;
