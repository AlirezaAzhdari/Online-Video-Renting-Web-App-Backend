const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../Models/User");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");

//Post a new user
router.post(
  "/register",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body, "register");
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = await User.findOne({ name: req.body.name });
    if (user) {
      return res.status(400).send({ message: "User alreadey registered" });
    }

    const newUser = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashed;

    user = await newUser.save();
    const token = user.generateAuthToken();
    res
      .status(200)
      .header("x-auth-token", token)
      .json(_.pick(user, ["_id", "name", "email"]));
  })
);

//Login
router.post(
  "/login",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body, "login");
    if (error) {
      return res
        .status(400)
        .send({ message: "email and password are required" });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("user not found");

    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      const token = user.generateAuthToken();
      res
        .status(200)
        .header("x-auth-token", token)
        .json({ success: true, token: token });
    } else {
      return res.status(400).send({ message: "password is not correct" });
    }
  })
);

//Get: current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

module.exports = router;
