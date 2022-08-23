const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Task = new Schema(
  {
    title: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["CREATED", "IN_PROGRESS", "DONE"],
    },
    created_date: { type: Date },
    updated_date: { type: Date },
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    tags: { type: [] },
  },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Task", Task);
