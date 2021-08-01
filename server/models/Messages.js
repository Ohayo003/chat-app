import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema(
  {
    conId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { collection: 'messages', timestamps: true }
);

export default mongoose.model("Messages", MessagesSchema);
