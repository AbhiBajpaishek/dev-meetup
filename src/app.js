const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./config/database");
const User = require("./models/user");
const asyncHandler = require("./middlewares/errorHandler");
const signUpRequestValidator = require("./utils/validators");

const app = express();
// express.json() reads body from req and extracts if body has JSON object and translates it into JS code
app.use(express.json());

// get user by email

const logic = async (req, res) => {
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
};

app.get("/user", asyncHandler(logic));
app.get(
  "/user:id",
  asyncHandler((req, res) => {})
);

// get all users from DB
app.get(
  "/feed",
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json({ status: "Ok", data: { ...users } });
  })
);

// delete a user
app.delete(
  "/user",
  asyncHandler(async (req, res) => {
    const id = req.body.userId;
    await User.findByIdAndDelete(id);
    res.json({ status: "Ok", data: {} });
  })
);

// update user with _id
app.patch(
  "/user/:userId",
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

    // validate size of skills fiel
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

app.post(
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

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid credentials!");
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) throw new Error("Invalid credentials!");
    res.json({
      status: "Ok",
      message: "Login Successfull",
    });
  })
);

db.connectDB()
  .then(() => {
    console.log("Database Connection Succesfull");
    app.listen(5000, () => {
      console.log("Http Server running at http://localhost:5000");
    });
  })
  .catch((err) => console.error("Database connecttion error: ", err));
