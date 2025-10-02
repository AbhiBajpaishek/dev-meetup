const { Router } = require("express");
const { asyncHandler } = require("../middlewares/errorHandler");
const { userAuth } = require("../middlewares/auth");

const userRouter = Router();

// get all users from DB
userRouter.get(
  "/feed",
  userAuth,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json({ status: "Ok", data: { ...users } });
  })
);

module.exports = userRouter;
