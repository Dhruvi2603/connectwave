import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";
import messageRoutes from './routes/message.js';
import http from "http";
import { Server as socketIo } from "socket.io";
import Message from "./models/Message.js";

// Configurations
const app = express();
const server = http.createServer(app); // Create an HTTP server

// Configure CORS for Express
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow additional methods
    credentials: true // Allow credentials if needed
}));


// Configure Socket.IO with CORS options
const io = new socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // Replace with your frontend origin
        methods: ["GET", "POST"],
        credentials: true // Allow credentials if needed
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// File storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Routes with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/message", messageRoutes);

const userSocketMap = {}

export const getRecieverSocketId = (recieverId) => userSocketMap[recieverId];

// Socket.IO setup
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ID ${userId} connected with socket ID ${socket.id}`);
    }
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
        console.log(`User ID ${userId} disconnected`);
      }
    });
  });
  



// Export io instance
export { io };


// Mongoose setup
const PORT = process.env.PORT || 6001;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(() => {
        server.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));

