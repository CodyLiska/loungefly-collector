const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const UserBackpack = require("../models/UserBackpack");

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
    // Get all user's backpacks
    const userBackpacks = await UserBackpack.find({ user: req.user.id })
      .populate('backpack')  
      .lean();

    // Calculate statistics
    const stats = {
      total: userBackpacks.length,
      owned: userBackpacks.filter(bp => bp.owned).length,
      wishlist: userBackpacks.filter(bp => bp.wishlist).length,
    };

    // Get recently added backpacks (last 3)
    const recentlyAdded = userBackpacks
      .sort((a, b) => b.addedToCollection - a.addedToCollection)
      .slice(0, 3)
      .map(ub => ({
        _id: ub._id,
        image: ub.backpack.Image,
        backpackName: ub.backpack.Name,
      }));

    // Group backpacks by franchise
    const franchiseCount = userBackpacks.reduce((acc, ub) => {
      const franchises = ub.backpack.Franchise || 'Uncategorized';
      acc[franchises] = (acc[franchises] || 0) + 1;
      return acc;
    }, {});

    // Sort franchises by count and get top 5
    const topFranchises = Object.entries(franchiseCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([franchises, franchiseCount]) => ({ franchises, franchiseCount }));

    res.render("dashboard", {
      name: req.user.displayName,
      stats,
      recentlyAdded,
      topFranchises,
      hasBackpacks: userBackpacks.length > 0
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
