const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/samp_tech_database")
  .then(() => {
    console.log("Database Connect Successfully");
  })
  .catch(() => {
    console.log("Unable to Connect Database");
  });

// mongoose.connect(
//  "mongodb://localhost:27017/samp_tech_database",
//   { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
//   () => {
//     console.log('Connected to MongoDB');
//   }
// );
