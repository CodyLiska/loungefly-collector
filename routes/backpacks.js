const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const {
  getSearchPage,
  getSingleBackpackById,
  getUsersCollectionPage,
  editBackpack,
  updateBackpack,
  getAddPage,
  addUserCreatedBackpack,
  deleteBackpack,
  addBackpackFromDatabase,
} = require("../controllers/backpackController");

// @desc    Show the add.hbs page
// @route   GET /backpacks/add
router.get("/add", ensureAuth, getAddPage);

// @desc    Process the add form
// @route   POST /backpacks/addToUserCollection
router.post("/addToUserCollection", ensureAuth, addUserCreatedBackpack);

// @desc    Edit a backpack by id
// @route   GET /backpacks/edit/:id
router.get("/edit/:id", ensureAuth, editBackpack);

// @desc    Update and Delete routes for backpack
// @route   PUT /backpacks/:id
// @route   DELETE /backpacks/:id
// router.route("/:id")
// .put(ensureAuth, updateBackpack)
// .delete(ensureAuth, deleteBackpack);

// @desc    Add a backpack to users collection
// @route   POST /backpacks/:id/add
router.post("/:id/add", ensureAuth, addBackpackFromDatabase);





// Below are working**

// @desc    Show the search page
// @route   GET /backpacks/search
router.get("/search", ensureAuth, getSearchPage);

// @desc    Show a single backpack by id
// @route   GET /backpacks/show/:id
router.get("/show/:id", ensureAuth, getSingleBackpackById);

// @desc    Show user's backpack collection page
// @route   GET backpacks/collection
router.get("/collection", ensureAuth, getUsersCollectionPage);

// @desc    Edit a backpack by id
// @route   GET /backpacks/edit/:id
router.get("/edit/:id", ensureAuth, editBackpack);

// @desc    Update a backpack
// @route   PUT /backpacks/:id
router.put("/edit/:id", ensureAuth, updateBackpack);

module.exports = router;
