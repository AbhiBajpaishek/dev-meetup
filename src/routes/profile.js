const { Router } = require("express");
const { asyncHandler } = require("../middlewares/errorHandler");
const { userAuth } = require("../middlewares/auth");
const { profileUpdateRequestValidator } = require("../utils/validators");

const profileRouter = Router();

profileRouter.get(
  "/profile",
  userAuth,
  asyncHandler(async (req, res) => {
    const user = req.user;
    res.json({
      status: "Ok",
      data: { ...user },
    });
  })
);

// update user with _id
profileRouter.patch(
  "/profile/edit/",
  userAuth,
  asyncHandler(async (req, res) => {
    const loggedInUser = req.user; // injected during userAuth middleware
    const userRequest = req.body;

    // validate req body
    profileUpdateRequestValidator(req);

    Object.keys(userRequest).forEach(
      (key) => (loggedInUser[key] = userRequest[key])
    );
    await loggedInUser.save();
    res.json({ status: "ok", data: { ...loggedInUser } });
  })
);

// delete a user
profileRouter.delete(
  "/profile",
  userAuth,
  asyncHandler(async (req, res) => {
    const id = req.body.userId;
    await User.findByIdAndDelete(id);
    res.json({ status: "Ok", data: {} });
  })
);

// get user profile by email
profileRouter.get(
  "/profileByEmail",
  userAuth,
  asyncHandler(async (req, res) => {
    const { emailId: userEmail } = req.body;
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).json({
        status: "Error",
        data: {},
      });
    } else {
      res.json({ status: "Ok", data: { ...user } });
    }
  })
);

module.exports = profileRouter;
