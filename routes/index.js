const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const UserBackpack = require("../models/UserBackpack");
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
        bg_name: ub.backpack.bg_name,
        bg_image: ub.backpack.bg_image,
        bg_price: ub.purchasePrice || ub.backpack.bg_price,
        bg_series: ub.backpack.bg_series,
        owned: ub.owned,
        wishlist: ub.wishlist,
        addedAt: ub.addedToCollection
      }));

    // Group backpacks by series
    const seriesCount = userBackpacks.reduce((acc, ub) => {
      const series = ub.backpack.bg_series || 'Uncategorized';
      acc[series] = (acc[series] || 0) + 1;
      return acc;
    }, {});

    // Sort series by count and get top 5
    const topSeries = Object.entries(seriesCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([series, count]) => ({ series, count }));

    res.render("dashboard", {
      name: req.user.displayName,
      stats,
      recentlyAdded,
      topSeries,
      hasBackpacks: userBackpacks.length > 0
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
