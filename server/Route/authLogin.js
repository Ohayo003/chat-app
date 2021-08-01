import express from "express";
const authLogin = express.Router();
import UsersSchema from "../models/users.js";
import BCrypt from "bcrypt";




authLogin.post("/", (req, res) => {
  let getUser;
  const password = req.body.password;
  UsersSchema.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "User does not Exist",
        });
      }
      getUser = user;
      return BCrypt.compare(password, user.userPassword);
    })
    .then((response) => {
      if (!response) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }
      res.status(200).json(getUser)
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    });
});

export default authLogin;
