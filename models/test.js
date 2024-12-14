const mongoose = require("mongoose");

const UserBackpackSchema = new mongoose.Schema({
  /*-------------------------------
  //other models needed               <-- use these as an example for how to refactor the below models
  --------------------------------*/
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  backpack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Backpack",
    required: true
  },

  /*-------------------------------
  // personal collection properties - UserCollectionBackpackModel.cs will inherrit from BackpackBaseModel<-- when i get to refactoring
  --------------------------------*/
  owned: {
    type: Boolean,
    default: false,
    required: true
  },
  wishlist: {
    type: Boolean,
    default: false,
    required: true
  },
  condition: {
    type: String,
    default: null,
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable']
  },
  purchaseDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Purchase date cannot be in the future'
    }
  },
  personalNotes: {
    type: String,
    default: null,
    maxLength: 1000
  },

  /*-------------------------------
  // universal backpack properties - BackpackBaseModel.cs <-- when i get to refactoring
  --------------------------------*/
  
  heartLogo: {
    type: String,
    default: null,
    trim: true
  },
  image: {
    type: String,
    default: '/img/no-image.jpg'
  },
  matchingWallet: {
    type: String,
    default: null,
    trim: true,
    maxLength: 100
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  size: {
    type: String,
    default: null,
    trim: true,
    maxLength: 100
  },
  // Backpack Tags: Hard Tag/Soft Tag
  hardTagOrSoftTag: {
    type: String,
    default: null,
    maxLength: 8
  },
  dateReleased: {
    type: Date,
    default: null
  },
  // Backpack styles: Crossbody/Handbag/Tote/Backpack/etc
  bagStyle: {
    type: String,
  },
  // Backpack Patterns: Cosplay/AOP/etc
  patternType: {
    type: String,
    default: null,
    maxLength: 50
  },
  // Backpack Sequins: Y/N
  sequins: {
    type: Char,
    default: null,
    maxLength: 1
  },
  franchise: {
    type: String,
    default: null,
    maxLength: 50
  },
  seriesTitle: {
    type: String,
    default: null,
    maxLength: 50
  },
  exclusive: {
    type: Char,
    default: null,
    maxLength: 1
  },
  loungeflyTag: {
    type: String,
    default: null,
    maxLength: 50
  },
  shopsIfExclusive: {
    type: String,
    default: null,
    maxLength: 50
  },
  countryIfExclusive: {
    type: String,
    default: null,
    maxLength: 50
  },
  otherTags: {
    type: String,
    default: null,
    maxLength: 50
  },
  matchingWalletAlt: {
    type: String,
    default: null,
    maxLength: 50
  },
  upc: {
    type: String,
    default: null,
    maxLength: 50
  },
});
