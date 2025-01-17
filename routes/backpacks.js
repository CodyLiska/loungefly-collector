const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const {
  getAddPage,
  addUserCreatedBackpack,
  getUsersCollectionPage,
  getSingleBackpackById,
  editBackpack,
  updateBackpack,
  deleteBackpack,
  getSearchPage,
  addBackpackFromDatabase,
} = require("../controllers/backpackController");

// @desc    Show the add.hbs page
// @route   GET /backpacks/add
router.get("/add", ensureAuth, getAddPage);

// @desc    Process the add form
// @route   POST /backpacks/addToUserCollection
router.post("/addToUserCollection", ensureAuth, addUserCreatedBackpack);

// @desc    Show user's backpack collection page
// @route   GET /backpacks
router.get("/", ensureAuth, getUsersCollectionPage);



// @desc    Edit a backpack by id
// @route   GET /backpacks/edit/:id
router.get("/edit/:id", ensureAuth, editBackpack);

// @desc    Update and Delete routes for backpack
// @route   PUT /backpacks/:id
// @route   DELETE /backpacks/:id
router.route("/:id")
  .put(ensureAuth, updateBackpack)
  .delete(ensureAuth, deleteBackpack);


// @desc    Add a backpack to users collection
// @route   POST /backpacks/:id/add
router.post("/:id/add", ensureAuth, addBackpackFromDatabase);
////
////
////







// Below are working**

// @desc    Show the search page
// @route   GET /backpacks/search
router.get("/search", ensureAuth, getSearchPage);

// @desc    Show a single backpack by id
// @route   GET /backpacks/show/:id
router.get("/show/:id", ensureAuth, getSingleBackpackById);

module.exports = router;
