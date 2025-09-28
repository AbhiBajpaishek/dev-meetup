const mongoose = require("mongoose");

// create user schema for creating a model
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

// creating a model of userSchema. Models should start from Capital Letters by best standards
const User = mongoose.model("User", userSchema);

module.exports = User;
