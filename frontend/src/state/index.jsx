import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  friends: [],
  selectedUser: null,
  messages: [], // State for messages
  error: null, // State for error handling
  socket: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.socket?.close();
      state.socket = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User is not logged in. Cannot set friends.");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload.post._id ? action.payload.post : post
      );
    },
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
    
    addMessage: (state, action) => {
      const newMessage = action.payload.message;
      const messageExists = state.messages.some(msg => msg._id === newMessage._id);
      if (!messageExists) {
        state.messages = [...state.messages, newMessage];
      }
    },
    
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setMessages,
  addMessage,
  setError,
  clearError,
  setSelectedUser,
  setSocket,
} = authSlice.actions;

export default authSlice.reducer;
