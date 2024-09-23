const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Backpack = require("../models/Backpack");
const User = require("../models/User");

// @desc    Login/Landing page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("backpacks").lean();

    res.render("dashboard", {
      name: req.user.displayName,
      backpacks: user.backpacks,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
  // try {
  //   const backpacks = await Backpack.find({ user: req.user.id }).lean();
  //   res.render("dashboard", {
  //     name: req.user.firstName,
  //     backpacks,
  //   });
  // } catch (err) {
  //   console.error(err);
  //   res.render("error/500");
  // }
});

module.exports = router;
