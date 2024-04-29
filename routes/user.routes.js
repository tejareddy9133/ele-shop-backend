const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const { sendEmail } = require("../services/email");

const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  const { name, email, pass, gender, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.json({ err: err.message });
      } else {
        const user = new UserModel({ name, email, pass: hash, gender, age });
        await user.save();
        res.json({ msg: "new user has been registered", user: req.body });
      }
    });
  } catch (error) {
    res.json({ err: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await UserModel.findOne({ email }); //we are going to mongodb andd getteing details of particular email
    if (user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if (result) {
          let token = jwt.sign({ email: user.email }, "chaina");
          res.json({ msg: "Loggedin", token });
        } else {
          res.json({ msg: "wrong credentials" });
        }
      });
    } else {
      res.json({ msg: "account not found on this email" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
});
module.exports = { userRouter };
