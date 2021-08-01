import express from "express";
import ConversationSchema from "../models/Conversation.js";
const ConversationRoute = express.Router();


//Create new Conversation
ConversationRoute.post("/conversation", async (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;

  const newConversation = new ConversationSchema({
    members: [senderId, receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
    
  } catch (error) {
    res.status(500).jason(error);
  }
});

//Get Conversation by user ID
ConversationRoute.get("/conversation/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const conversation = await ConversationSchema.find({
            members: { $in: [ userId ] },
        })
        res.status(200).json(conversation); 
    } catch (error) {
        res.status(500).json(error)
    }
})

//get conversation of the specific friend and the current user 
ConversationRoute.get("/conversation/getconversation/:firstUserId/:secondUserId", async (req, res) => {
  const firstUserId = req.params.firstUserId;
  const secondUserId = req.params.secondUserId;

  try {
    const userConversation = await ConversationSchema.findOne({
      members: { $all: [firstUserId, secondUserId]}
    });
    res.status(200).json(userConversation);
  } catch (error) {
    console.log(error)
    res.status(401).json(err);
  }

})

//Delete Conversation
ConversationRoute.delete("/conversation/:conId", async (req, res) => {
  const conId = req.params.conId;

  try { 
    await ConversationSchema.remove({_id: conId}).then(response =>{
      if(response){
        res.status(200).json('the messages has been deleted')
      }
      res.status(401).json("Failed to delete")
    })
  } catch (error) {
    res.status(401).json(error);
  }
})


//Get the members of conversation by conversationId
ConversationRoute.get("/conversation/getConversation/:conversationId", async (req, res) => {
  const conversationId = req.params.conversationId;
  try {
    const conversation = await ConversationSchema.findById(conversationId);
    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json(error)
  }
})
export default ConversationRoute;
