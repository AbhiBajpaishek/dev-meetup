const { Router } = require("express");
const { asyncHandler } = require("../middlewares/errorHandler");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const connectionRouter = new Router();

connectionRouter.post(
  "/connection/:status/:toId",
  userAuth,
  asyncHandler(async (req, res) => {
    const fromId = req.user._id;
    const toId = req.params.toId;
    const status = req.params.status;

    const ALLOWED_STATUS = ["interested", "ignored"];

    const validStatus = ALLOWED_STATUS.includes(status);

    if (!validStatus) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid Status: " + status,
      });
    }

    const existingConnection = await ConnectionRequest.findOne({
      $or: [
        { fromId, toId },
        { fromId: toId, toId: fromId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({
        status: "Error",
        message: "Connection Request Already exists",
      });
    }

    const user = await User.findById({ _id: toId });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User Not Found" });
    }

    const connection = new ConnectionRequest({
      fromId,
      toId,
      status,
    });
    const data = await connection.save();
    res.json({ status: "Ok", message: "Request sent succesfully", data });
  })
);

module.exports = connectionRouter;
