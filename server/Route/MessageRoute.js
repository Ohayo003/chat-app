import express from "express";
import MessagesSchema from "../models/Messages.js";
// import db from '../dbConnection.js';

const messagesRoute = express.Router();

//Create Message
messagesRoute.post("/messages", async (req, res) => {
  const newMessage = new MessagesSchema(req.body);

  try {
    const saveMessage = await newMessage.save();
    res.status(200).json(saveMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get messages
messagesRoute.get("/messages/:conversationId", async (req, res) => {
  const id = req.params.conversationId;
  try {
    const convoMessages = await MessagesSchema.find({
      conId: id,
    });
    res.status(200).json(convoMessages);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete Messages using ConversationId
messagesRoute.delete("/messages/:conId", async (req, res) => {
  const conId = req.params.conId;

  try {
    await MessagesSchema.deleteMany({ conId: conId })
      .then((response) => {
        if (!response) {
          res.status(401).json("Failed to delete messages");
        }
        res.status(200).json("messages has been deleted");
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(401).json(error);
  }
});
export default messagesRoute;
