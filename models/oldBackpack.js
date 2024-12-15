const mongoose = require("mongoose");

const BackpackSchema = new mongoose.Schema({
  bg_name: {
    type: String,
    required: true,
    trim: true
  },
  bg_image: {
    type: String,
    default: '/img/no-image.jpg'
  },
  bg_price: {
    type: Number,
    required: true,
    min: 0
  },
  bg_series: {
    type: String,
    trim: true
  },
  bg_link: {
    type: String,
    trim: true
  },
  bg_fromSite: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("oldBackpack", BackpackSchema);
