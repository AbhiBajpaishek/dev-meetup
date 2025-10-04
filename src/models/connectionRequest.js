const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    toId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      required: true,
      enum: ["interested", "rejected", "ignored", "accepted"],
      message: "{VALUE} is not a valid status!",
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ toId: 1, fromId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.toId.equals(connectionRequest.fromId)) {
    throw new Error("Cannot send self request");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
