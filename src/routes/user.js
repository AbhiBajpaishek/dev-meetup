const { Router } = require("express");
const { asyncHandler } = require("../middlewares/errorHandler");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = Router();

// get all pending connection requests for loggedIn User
userRouter.get(
  "/user/requests/received",
  userAuth,
  asyncHandler(async (req, res) => {
    const user = req.user;
    const requests = await ConnectionRequest.find({
      toId: user._id,
      status: "interested",
    }).populate("fromId", [
      "firstName",
      "lastName",
      "age",
      "skills",
      "gender",
      "photoUrl",
      "about",
    ]);

    res.json({ status: "Ok", data: { ...requests } });
  })
);


// get all accepted requests for loggedIn User
userRouter.get(
  "/user/requests/accepted",
  userAuth,
  asyncHandler(async (req, res) => {
    const user = req.user;
    const requests = await ConnectionRequest.find({
      fromId: user._id,
      status: "accepted",
    }).populate("toId", [
      "firstName",
      "lastName",
      "age",
      "skills",
      "gender",
      "photoUrl",
      "about",
    ]);

    res.json({ status: "Ok", data: { ...requests } });
  })
);

// get users to show in feed
userRouter.get(
  "/user/feed",
  userAuth,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json({ status: "Ok", data: { ...users } });
  })
);

module.exports = userRouter;
