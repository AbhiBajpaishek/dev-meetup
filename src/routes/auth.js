const express = require("express");
const bcrypt = require("bcrypt");
const { asyncHandler } = require("../middlewares/errorHandler");
const signUpRequestValidator = require("../utils/validators");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    // signup request validation
    signUpRequestValidator(req);

    // Password encryption
    const password = await bcrypt.hash(req.body.password, 10);

    const {
      firstName,
      lastName,
      emailId,
      skills,
      photoUrl,
      age,
      gender,
      about,
    } = req.body;
    const newUser = new User({
      firstName,
      lastName,
      gender,
      age,
      emailId,
      password,
      photoUrl,
      skills,
      about,
    });
    await newUser.save();
    res.json({ "Status:": "Ok", data: { ...newUser } });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid credentials!");

    const isCorrect = await user.validatePassword(password);
    if (!isCorrect) throw new Error("Invalid credentials!");

    // generate JWT
    const token = await user.generateJwt();

    res
      .cookie("jwt", token, { expires: new Date(Date.now() + 1 * 3600000) }) // 1 sec = 1000ms, 1 min =  60,000msg, 1hr= 36,00,000ms
      .json({
        status: "Ok",
        message: "Login Successfull",
      });
  })
);

module.exports = authRouter;
