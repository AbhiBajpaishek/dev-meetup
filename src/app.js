const express = require("express");
const db = require("./config/database");
const User = require("./models/user");
const asyncHandler = require("./middlewares/errorHandler");

const app = express();
// express.json() reads body from req and extracts if body has JSON object and translates it into JS code
app.use(express.json());

//get user by email

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

app.patch(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const userBody = req.body;
    const id = req.params.userId;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...userBody }
    );
    res.json({ status: "ok", data: { ...updatedUser } });
  })
);

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  const newUser = new User({
    firstName,
    lastName,
    emailId,
    password,
  });
  await newUser.save();
  res.json({ "Status:": "Ok", data: { ...newUser } });
});

db.connectDB()
  .then(() => {
    console.log("Database Connection Succesfull");
    app.listen(5000, () => {
      console.log("Http Server running at http://localhost:5000");
    });
  })
  .catch((err) => console.error("Database connecttion error: ", err));
