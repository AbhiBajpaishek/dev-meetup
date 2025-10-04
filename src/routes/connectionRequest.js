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

connectionRouter.post(
  "/connection/review/:status/:id",
  userAuth,
  asyncHandler(async (req, res) => {
    const { status, id: fromId } = req.params;
    const toId = req.user._id;

    // validate request
    const ALLOWED_STATUS = ["accepted", "rejected"];

    const validStatus = ALLOWED_STATUS.includes(status.toLowerCase());

    if (!validStatus) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid Status: " + status,
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      toId,
      fromId,
      status: "interested", // we dont want to allow review is status is other than interested
    });
    if (!connectionRequest) {
      return res.status(404).json({
        status: "Error",
        message: "Connection not found!",
      });
    }

    connectionRequest.status = status;
    await connectionRequest.save();
    return res.json({
      status: "Ok",
      message:
        status === "accepted"
          ? "Request Accepted Succesfully!"
          : "Request Rejected Succesfully",
    });
  })
);

module.exports = connectionRouter;
