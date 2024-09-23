const mongoose = require("mongoose");

const BackpackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bg_name: {
    type: String,
    require: true,
    trim: true,
  },
  bg_image: {
    data: Buffer,
    type: String,
    default: null,
  },
  bg_price: {
    type: String,
    default: null,
    trim: true,
  },
  bg_series: {
    type: String,
    default: null,
    trim: true,
  },
  bg_link: {
    type: String,
    default: null,
    trim: true,
  },
  bg_fromSite: {
    type: String,
    default: null,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Backpack", BackpackSchema);
