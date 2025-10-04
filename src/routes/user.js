const { Router } = require("express");
const { asyncHandler } = require("../middlewares/errorHandler");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const VALID_USER_RESPONSE_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "skills",
  "gender",
  "photoUrl",
  "about",
];

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
    }).populate("fromId", VALID_USER_RESPONSE_FIELDS);

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
      $or: [
        { fromId: user._id, status: "accepted" },
        { toId: user._id, status: "accepted" },
      ],
    })
      .populate("toId", VALID_USER_RESPONSE_FIELDS)
      .populate("fromId", VALID_USER_RESPONSE_FIELDS);
    const data = requests.map((r) => {
      if (r.fromId == user._id) return r.toId;
      return r.fromId;
    });
    res.json({ status: "Ok", data });
  })
);

// get users to show in feed
userRouter.get(
  "/user/feed",
  userAuth,
  asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 10 ? 10 : limit;

    // loggedIn User must not see below users in its feed
    // 1. Users who have either marked as interested or ignored
    // 2. Users whose request is already accepted
    // 3. User himself

    // So basically, filter out users when loggedIn user is in fromId and toId

    const usersToFilter = await ConnectionRequest.find({
      $or: [{ fromId: loggedInUser._id }, { toId: loggedInUser._id }],
    });

    const userSet = new Set();
    usersToFilter.forEach((u) => {
      userSet.add(u.toId);
      userSet.add(u.fromId);
    });

    const usersToShowInFeed = await User.find({
      $and: [
        { _id: { $nin: [...Array.from(userSet)] } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(VALID_USER_RESPONSE_FIELDS)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ status: "Ok", data:  usersToShowInFeed  });
  })
);

module.exports = userRouter;
