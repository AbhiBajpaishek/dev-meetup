const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("./errorHandler");

const userAuth = asyncHandler(async (req, res, next) => {
  // fetch jwt from cookie
  const token = req.cookies["jwt"];
  // verify the jwt
  const payload = await jwt.verify(token, "secret");
  // fetch user based on _id from payload
  const user = await User.findById(payload._id);
  // attach user in req and call next()
  req.user = user;
  next();
});

module.exports = {
  userAuth,
};
