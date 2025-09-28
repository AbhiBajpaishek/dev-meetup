const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:8wyh679Mw2XWC6hg@dummycluster.bh0bnm6.mongodb.net/devMeetup"
  );
};

module.exports = { connectDB };
