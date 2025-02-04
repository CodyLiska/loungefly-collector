const mongoose = require("mongoose");

const BackpackSchema = new mongoose.Schema({
  heartLogo: {
    type: String,
    default: null,
    trim: true,
  },
  image: {
    type: String,
    default: "/img/no-image.jpg",
  },
  matchingWallet: {
    type: String,
    default: null,
    trim: true,
    maxLength: 100,
  },
  name: {
    type: String,
    //required: true,
    trim: true,
    maxLength: 100,
  },
  size: {
    type: String,
    default: null,
    trim: true,
    maxLength: 100,
  },
  // Backpack Tags: Hard Tag/Soft Tag
  hardTagOrSoftTag: {
    type: String,
    default: null,
    maxLength: 8,
  },
  dateReleased: {
    type: Date,
    default: null,
  },
  // Backpack styles: Crossbody/Handbag/Tote/Backpack/etc
  bagStyle: {
    type: String,
  },
  // Backpack Patterns: Cosplay/AOP/etc
  patternType: {
    type: String,
    default: null,
    maxLength: 50,
  },
  // Backpack Sequins: Y/N
  sequins: {
    type: String,
    default: null,
    maxLength: 1,
  },
  franchise: {
    type: String,
    default: null,
    maxLength: 50,
  },
  seriesCollection: {
    type: String,
    default: null,
    maxLength: 50,
  },
  exclusive: {
    type: String,
    default: null,
    maxLength: 1,
  },
  loungeflyTag: {
    type: String,
    default: null,
    maxLength: 50,
  },
  shopsIfExclusive: {
    type: String,
    default: null,
    maxLength: 50,
  },
  countryIfExclusive: {
    type: String,
    default: null,
    maxLength: 50,
  },
  otherTags: {
    type: String,
    default: null,
    maxLength: 50,
  },
  matchingWalletAlt: {
    type: String,
    default: null,
    maxLength: 50,
  },
  upc: {
    type: String,
    default: null,
    maxLength: 50,
  },
  onlineStore: {
    type: String,
    default: null,
    maxLength: 50,
  },
  productURL: {
    type: String,
    default: null,
    maxLength: 1000,
  },
});

module.exports = mongoose.model("Backpack", BackpackSchema);