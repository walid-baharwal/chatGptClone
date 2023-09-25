const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  month: {
    type: String,
    default: function () {
      return new Date().toLocaleString("en-US", { month: "long" });
    },
  },
});

module.exports = mongoose.model("users", UserSchema);
