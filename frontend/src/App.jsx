import React, { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import ProfilePage from "./scenes/profilePage/ProfilePage";
import HomePage from "./scenes/homePage/HomePage";
import LoginPage from "./scenes/loginPage/LoginPage";
import ChatPage from "./scenes/chatPage/ChatPage";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const isAuth = Boolean(token);
  const socketRef = useRef(null); // ✅ Local reference, not in Redux

  useEffect(() => {
    if (user && !socketRef.current) {
      const socketConnection = io("http://localhost:3001", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      socketRef.current = socketConnection;

      // You can add socket event listeners here if needed
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/chat" element={isAuth ? <ChatPage /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
