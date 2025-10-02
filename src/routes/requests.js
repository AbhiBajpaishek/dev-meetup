const { Router } = require("express");
const { asyncHandler } = require("../middlewares/errorHandler");
const { userAuth } = require("../middlewares/auth");

const requestsRouter = Router();

requestsRouter.post(
  "/sendConnectionRequest",
  userAuth,
  asyncHandler(async (req, res) => {
    res.json({ status: "Ok", data: {} });
  })
);

module.exports = requestsRouter;
