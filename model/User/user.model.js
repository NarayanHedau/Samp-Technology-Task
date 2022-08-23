const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const User = new Schema(
  {
    role: {
      type: String,
      enum: ["Admin", "Team_lead", "Developer"],
    },
    name:{type:String},
    email:{type:String},
    profile_pic:{type:String},
    password:{type:String}
 
  },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", User);
