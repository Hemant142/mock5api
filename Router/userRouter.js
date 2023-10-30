const express = require("express");

const { UserModel } = require("../Model/userModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  console.log(req.body)
  try {
    if (email && password && confirmPassword) {
      const User = await UserModel.findOne({ email });
      console.log(User)
      if (User) {
        res.status(200).send({ "msg": "User already Exists" });
      } else {
        if (password !== confirmPassword) {
          res.status(200).send({ msg: "Password Do Not Match !" });
        } else {
          bcrypt.hash(password, 5, async function (err, hash) {
            if (hash) {
              const user = new UserModel({
                email,
                password: hash,
                confirmPassword: hash,
              });
              await user.save();
              res.status(200).send({ msg: "New User Has Been Registered ! " });
            } else {
              res.status(400).send({ msg: "err" });
            }
          });
        }
      }
    }
  } catch (err) {
    res.status(400).send({ msg: "err" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const User = await UserModel.findOne({ email });
    if (User) {
      bcrypt.compare(password, User.password, function (err, result) {
        if (result) {
          var token = jwt.sign({ foo: "bar" }, "masai");
          res
            .status(200)
            .send({ msg: "User is Logged in successfully", token });
        }
      });
    } else {
      res.status(200).send({ msg: "User Does Not Exist!" });
    }
  } catch (err) {
    res.status(400).send({ msg: "err" });
  }
});

module.exports = {
  userRouter,
};
