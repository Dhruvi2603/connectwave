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
import messageRoutes from "./routes/message.js";
import http from "http";
import { Server as socketIo } from "socket.io";
import Message from "./models/Message.js";

// Configurations
dotenv.config();
const app = express();
const server = http.createServer(app); // Create an HTTP server

// Determine allowed origins based on the environment
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ["https://connectwave-frontend.onrender.com"] 
    : ["http://localhost:5173"];

// CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow additional methods
    credentials: true
}));

// Socket.IO setup with CORS
const io = new socketIo(server, {
    cors: {
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(helmet());  // Helmet for security headers

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'none'"],  // Prevent framing for security
        scriptSrc: ["'self'", "'unsafe-inline'"],  // Adjust as needed
        styleSrc: ["'self'", "'unsafe-inline'"],  // Adjust as needed
    }
}));

// Setting X-Frame-Options as a fallback for older browsers
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Serve static files, including fonts, with Cache-Control headers and correct MIME types
app.use("/assets", express.static(path.join(__dirname, 'public/assets'), {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath);
        if (['.woff', '.woff2', '.jpg', '.png', '.js', '.css'].includes(ext)) {
            res.setHeader('Cache-Control', 'max-age=31536000, immutable');  // Cache static assets for 1 year
        }
        if (ext === '.woff2') {
            res.setHeader('Content-Type', 'font/woff2');
        } else if (ext === '.woff') {
            res.setHeader('Content-Type', 'font/woff');
        }
    }
}));

// File storage configuration with validation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// File filter for allowed types and size limit
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'), false);
        }
        cb(null, true);
    }
});

// Routes with file uploads
app.post("/auth/register", upload.single("picture"), async (req, res) => {
    try {
        await register(req, res);
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
});

app.post("/posts", verifyToken, upload.single("picture"), async (req, res) => {
    try {
        await createPost(req, res);
    } catch (error) {
        res.status(500).json({ message: "Post creation failed", error });
    }
});

// General Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/message", messageRoutes);

// Socket.IO setup for real-time messaging
const userSocketMap = {};

export const getRecieverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ID ${userId} connected with socket ID ${socket.id}`);
    }

    // Handle message sending
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
        const receiverSocketId = getRecieverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
        }

        // Save message in the database
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User ID ${userId} disconnected`);
        }
    });
});

// Mongoose setup
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));

// Export io instance
export { io };
