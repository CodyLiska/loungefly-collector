const mongoose = require("mongoose");

const UserBackpackSchema = new mongoose.Schema({
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
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Acceptable']
  },
  purchasePrice: {
    type: Number,
    min: 0
  },
  purchaseDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Purchase date cannot be in the future'
    }
  },
  personalNotes: {
    type: String,
    maxLength: 1000
  },
  series: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  customTags: [{
    type: String,
    trim: true
  }],
  addedToCollection: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Validate that either owned or wishlist is true, but not both
UserBackpackSchema.pre('save', function(next) {
  if (this.owned === this.wishlist) {
    next(new Error('A backpack must be either in owned or wishlist status, but not both'));
  }
  next();
});

module.exports = mongoose.model("UserBackpack", UserBackpackSchema);
