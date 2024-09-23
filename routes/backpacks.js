const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Backpack = require("../models/Backpack");
const User = require("../models/User");

// @desc    Show add backpack page
// @route   GET /backpacks/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("backpacks/add");
});

// @desc    Process the Add Form
// @route   POST /backpacks
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Backpack.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// // @desc    Show user's collection
// // @route   GET /backpacks
router.get("/", ensureAuth, async (req, res) => {
  try {
    const backpacks = await Backpack.find({ _id: req.params.id })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("backpacks/index", { backpacks });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Users backpacks
// @route   GET /backpacks/user/:id (only show the stories of the user in the URL)
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const backpacks = await Backpack.find({
      user: req.params.userId,
    })
      .populate("user")
      .lean();

    res.render("backpacks/index", {
      backpacks,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Show single backpack
// @route   GET /backpacks/:id
router.get("/show/:id", ensureAuth, async (req, res) => {
  try {
    let backpack = await Backpack.findById(req.params.id)
      .populate("user")
      .lean();

    if (!backpack) {
      return res.render("error/404");
    }

    res.render("backpacks/show", {
      backpack,
    });
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

// @desc    Show edit page
// @route   GET /backpacks/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    // const backpack = await Backpack.findOne({ _id: req.params.id }).lean();
    const backpack = await Backpack.findById(req.params.id).lean();

    if (!backpack) {
      return res.render("error/404");
    }

    if (req.user.backpacks.includes(backpack._id.toString())) {
      res.render("backpacks/edit", {
        backpack,
      });
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Update backpack
// @route   PUT /backpacks/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let backpack = await Backpack.findById(req.params.id).lean();

    if (!backpack) {
      return res.render("error/404");
    }

    if (req.user.backpacks.includes(backpack._id.toString())) {
      backpack = await Backpack.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.redirect("/dashboard");
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Delete backpack
// @route   DELETE /backpacks/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let backpack = await Backpack.findById(req.params.id).lean();

    if (!backpack) {
      return res.render("error/404");
    }

    if (req.user.backpacks.includes(backpack._id.toString())) {
      // Remove the backpack from the User's backpack array
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { backpacks: backpack._id } }
      );

      // Delete the backpack from the Backpack collection
      await Backpack.deleteOne({ _id: req.params.id });

      res.redirect("/dashboard");
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Show Loungefly Database search page
// @route   GET /backpacks/search/:query
router.get("/search/:query", ensureAuth, async (req, res) => {
  try {
    const backpacks = await Backpack.find({
      bg_name: new RegExp(req.query.query, "i"),
    })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("backpacks", { backpacks });
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
});

// @desc    Add Loungefly backpack to users collection array
// @route   POST /backpacks/addToCollection/:id
router.post("/addToCollection/:id", ensureAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const backpackId = req.params.id;

    const user = await User.findById(userId);
    user.backpacks.push(backpackId);
    await user.save();

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
