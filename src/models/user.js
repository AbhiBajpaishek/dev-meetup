const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(val) {
        if (!validator.isEmail(val)) throw new Error(val);
      },
    },
    password: {
      type: String,
      validate(pass) {
        if (!validator.isStrongPassword(pass)) throw new Error("Please Enter strong password " + pass);
      },
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
    photoUrl: {
      type: String,
      validate(url) {
        if (!validator.isURL(url)) throw new Error(url);
      },
    },
    about:{
      type: String,
      default: "This is default about information"
    }
  },
  { timestamps: true }
);

// creating a model of userSchema. Models should start from Capital Letters by best standards
const User = mongoose.model("User", userSchema);

module.exports = User;
