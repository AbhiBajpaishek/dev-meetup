const mongoose = require("mongoose");

// create user schema for creating a model
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLenght: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
      max: 150,
    },
    gender: {
      type: String,
      validate: {
        validator: (value) =>
          ["male", "female", "others"].includes(value.trim()),
        message: "Bad Request: Gender is not valid",
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// creating a model of userSchema. Models should start from Capital Letters by best standards
const User = mongoose.model("User", userSchema);

module.exports = User;
