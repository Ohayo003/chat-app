import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
    },
    { collection: 'Conversation', timestamps: true}
);

export default mongoose.model("Conversation", ConversationSchema);