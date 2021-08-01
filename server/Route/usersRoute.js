import express from "express";
const users = express.Router();
import UsersSchema from "../models/users.js";
import BCrypt from "bcrypt";

const saltRounds = 10;

//Get user by Id
users.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    await UsersSchema.findById(userId).then((response) => {
      if (!response) {
        res.status(401).send({
          message: "User does not exist",
        });
      }
      res.status(200).json(response);
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Get user by email
users.post("/email", async (req, res) => {
  const email = req.body.email;
  try {
    await UsersSchema.findOne({ email: email }).then((resp) => {
      if (!resp) {
        res.status(404).send({
          message: "email does not exist",
        });
      }
      res.status(200).json(resp);
    });
  } catch (error) {
    res.status(404).json(error);
  }
});

//Get friend by friend ID
users.get("/friend/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const currentUser = await UsersSchema.findById(userId);
    const usersFriend = await Promise.all(
      currentUser.friends.map((friendId) => {
        return UsersSchema.findById(friendId);
      })
    );
    let friendList = [];
    usersFriend.map((friend) => {
      const { _id, name, email } = friend;
      friendList.push({ _id, name, email });
    });
    // console.log(friendList);
    res.status(200).json(friendList);
  } catch (error) {
    res.status(401).json(error);
  }
});

//Update user password
users.put("/account/change-password/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (req.body.password) {
      req.body.password = await BCrypt.hash(req.body.password, saltRounds);
      await UsersSchema.updateOne({ _id: userId }, { $set: {userPassword: req.body.password} }).then(
        (response) => {
          res.status(200).json(response);
        }
      );
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//Delete a friend on the current user
users.put("/friends/:userId", async (req, res) => {
  const friendId = req.body.friendId;
  const userId = req.params.userId;
  try {
    const updateFriend = await UsersSchema.findOneAndUpdate(
      { _id: userId },
      { $pull: { friends: friendId } }
    );
    res.status(200).json(updateFriend.data);
  } catch (error) {
    res.status(401).json(error);
  }
});

//Add a friend
users.put("/friends/add/:userId", async (req, res) => {
  const userId = req.params.userId;
  const friendId = req.body.friendId;

  try {
    const addAFriend = await UsersSchema.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { friends: friendId } }
    );
    res.status(200).json(addAFriend);
  } catch (error) {
    res.status(200).json(error);
  }
});

export default users;
