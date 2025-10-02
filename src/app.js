const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./config/database");

const app = express();
// express.json() reads body from req and extracts if body has JSON object and translates it into JS code
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

db.connectDB()
  .then(() => {
    console.log("Database Connection Succesfull");
    app.listen(5000, () => {
      console.log("Http Server running at http://localhost:5000");
    });
  })
  .catch((err) => console.error("Database connecttion error: ", err));
