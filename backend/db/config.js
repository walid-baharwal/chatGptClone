const mongoose = require("mongoose");
require("dotenv").config({ path: "config.env" });
const mongoURI = process.env.DATABASE;
mongoose
  .connect(mongoURI)
  .then(() => console.log("Database connection established"))
  .catch((e) => console.log("Connection Failed", e));

module.exports = mongoose.connect;
