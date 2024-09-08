import Post from "../models/Post.js";
import User from "../models/User.js";

// Create post
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// Read posts
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// Update like
export const likePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
  
      // Find the post
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      // Convert post.likes from Map to object for manipulation
      let likes = post.likes.toObject();
  
      // Update likes
      if (likes[userId]) {
        // Remove like
        delete likes[userId];
      } else {
        // Add like
        likes[userId] = true;
      }
  
      // Convert likes back to Map
      const updatedLikes = new Map(Object.entries(likes));
  
      // Save the updated post
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: updatedLikes },
        { new: true }
      );
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };
  