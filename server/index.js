const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// 連結MongoDB
mongoose
  .connect("mongodb://localhost:27017/GoogleDB")
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 註冊、登入會員所使用的routes
app.use("/api/user", authRoute);

// course route已經被JWT保護起來。如果request的header當中沒有
// 任何JWT的令牌，那麼請求就會被認定是unauthorized。
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("Server running on port 8080.");
});
