const mongoose = require("mongoose");

const NewUserAddedBackpackModel = new mongoose.Schema({
  owned: {
    type: Boolean,
    default: false,
    required: true,
  },
  wishlist: {
    type: Boolean,
    default: false,
    required: true,
  },
  condition: {
    type: String,
    default: null,
    enum: ["New", "Like New", "Very Good", "Good", "Acceptable"],
  },
  addedToCollectionDate: {
    type: Date,
    default: null,
    validate: {
      validator: function (v) {
        return !v || v <= new Date();
      },
      message: "Purchase date cannot be in the future",
    },
  },
  purchasePrice: {
    type: Number,
    default: null,
    maxLength: 6,
  },
  personalNotes: {
    type: String,
    default: null,
    maxLength: 1000,
  },
});

// Validate that either owned or wishlist is true, but not both
NewUserAddedBackpackModel.pre('save', function(next) {
  if (this.owned === this.wishlist) {
    next(new Error('A backpack must be either in owned or wishlist status, but not both'));
  }
  next();
});

module.exports = mongoose.model("UserBackpack", NewUserAddedBackpackModel);
