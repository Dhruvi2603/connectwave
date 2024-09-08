import { io } from "../index.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { getRecieverSocketId } from "../index.js";

// Create a new message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id; // Access user ID from `req.user`
    const recieverId = req.params.id;
    const { textMessage: message } = req.body;

    // Validate message content
    if (!message || !senderId || !recieverId) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Find or create a conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    // Create a new message
    const newMessage = await Message.create({
      senderId,
      recieverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Implement socket for real-time data transfer
    const recieverSocketId = getRecieverSocketId(recieverId);
    console.log(`Recipient Socket ID for ${recieverId}: ${recieverSocketId}`);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a specific conversation
export const getMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const recieverId = req.params.id;

    if (!senderId || !recieverId) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    const messages = await Message.find({
      _id: { $in: conversation.messages },
    });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: error.message });
  }
};
