const { Router } = require("express");
const { asyncHandler } = require("../middlewares/errorHandler");
const { userAuth } = require("../middlewares/auth");

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
  "/profile/:userId",
  userAuth,
  asyncHandler(async (req, res) => {
    const userBody = req.body;
    const id = req.params.userId;

    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "skills",
      "photoUrl",
    ];
    const notAllowedFields = Object.keys(userBody).filter(
      (field) => !ALLOWED_FIELDS.includes(field)
    );
    if (notAllowedFields.length > 0) {
      throw new Error(
        "Bad Request. Fields not allowed: " + notAllowedFields.toString()
      );
    }

    // validate size of skills field
    const skills = userBody.skills;
    if (skills && skills.length > 10)
      throw new Error("Bad Request: Skills length cannot be more than 10");
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...userBody },
      { returnDocument: "after", runValidators: true }
    );
    res.json({ status: "ok", data: { ...updatedUser } });
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
