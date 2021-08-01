import express from "express";
import BCrypt from "bcrypt";
const RegisterRoute = express.Router();
import UsersSchema from "../models/users.js";

const saltRounds = 10;

RegisterRoute.post("/", (req, res) => {
  const name = req.body.name;
  const gender = req.body.gender;
  const email = req.body.email;
  const password = req.body.password;
  try {
    BCrypt.hash(password, saltRounds).then((hash) => {
      const user = new UsersSchema({
        name: name,
        gender: gender,
        email: email,
        userPassword: hash,
      });
      UsersSchema.find({email: email}, (err, docs) => {
        if(docs.length === 1){
            res.status(409).json('Email already exist')
        }
        else if(err){
          res.status(400).json(err);
        }
        else{
          user.save().then((response) => {
            res.status(201).json(response);
          })
        }
      })
    });
  } catch (error) {
    console.log(error);
  }
});
export default RegisterRoute;
