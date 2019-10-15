const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
//const helmet = require("helmet");
//const morgan = require("morgan");
//const config = require("config");
const mongoose = require("mongoose");
//const debug = require("debug")("vidly:startup");

const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const app = express();
const port = process.env.PORT || 3000;

// console.log(`Application name: ${config.get("name")}`);
// console.log(`Mail name: ${config.get("mail.host")}`);
//console.log(`Mail password: ${config.get("mail.password")}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/genres", genres);
app.use("/api/rentals", rentals);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
// app.use(helmet());
// app.use(express.static("public"));
// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   debug("Morgan enabled");
// }

mongoose
  .connect(
    "mongodb://localhost/Vidly",
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongoDB connected"))
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
