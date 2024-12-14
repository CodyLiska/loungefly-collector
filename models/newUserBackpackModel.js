const mongoose = require("mongoose");

const newUserAddedBackpackModel = new mongoose.Schema({
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
  purchaseDate: {
    type: Date,
    default: null,
    validate: {
      validator: function (v) {
        return !v || v <= new Date();
      },
      message: "Purchase date cannot be in the future",
    },
  },
  personalNotes: {
    type: String,
    default: null,
    maxLength: 1000,
  },
});
