const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  backpacks: [{ type: Schema.Types.ObjectId, ref: "Backpack" }],
});

module.exports = mongoose.model("User", UserSchema);
