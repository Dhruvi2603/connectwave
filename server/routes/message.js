import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { sendMessage, getMessage } from "../controllers/message.js";

const router = express.Router();

// Create a new message
// Route: POST /api/messages/:id
router.post('/:id', verifyToken, sendMessage);

// Get all messages for a specific conversation
// Route: GET /api/messages/:id
router.get('/:id', verifyToken, getMessage);

export default router;
