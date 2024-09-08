import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        recieverId: {
            type: String, // User ID of the sender
            ref: 'User'
        },
        message: {
            type: String,
            required: true,
        },
        // Additional fields can be added if needed
    },
    { timestamps: true } // Adds createdAt and updatedAt timestamps
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
