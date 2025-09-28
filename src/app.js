const express = require("express");
const db = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const newUser = new User({
    firstName: "Abhish",
    lastName: "Mathhew",
    emailid: "matthew@gmail.com",
    password: "matthew@123",
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
