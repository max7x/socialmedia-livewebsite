const express = require("express");
const auth = require("./src/auth");
const bodyParser = require("body-parser");
const profile = require("./src/profile");
const cookieParser = require("cookie-parser");
const articles = require("./src/articles");
const following = require("./src/following");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require("./config.json");

const corsOptions = {
  origin: config.frontendUrl,
  credentials: true,
};
const connectionString = config.mongoDBUrl;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Connecting to the database
mongoose.Promise = global.Promise;
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.send("Hello");
});

auth(app);
articles(app);
profile(app);
following(app);

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  const addr = server.address();
  console.log(`Server listening at http://${addr.address}:${addr.port}`);
});
