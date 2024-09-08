import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import ProfilePage from "./scenes/profilePage/ProfilePage";
import HomePage from "./scenes/homePage/HomePage";
import LoginPage from "./scenes/loginPage/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import ChatPage from "./scenes/chatPage/ChatPage";
import { setSocket } from "./state";
import { io } from "socket.io-client";

function App() {
  const user = useSelector((state) => state.user);
  const socket = useSelector((state) => state.socketio);
  const isAuth = Boolean(useSelector((state) => state.token));
  const dispatch = useDispatch();

  useEffect(() => {
    let socketConnection;

    if (user && !socket) {
      socketConnection = io('https://connectwave-backend.onrender.com', {
        query: {
          userId: user._id
        },
        transports: ['websocket']
      });

      dispatch(setSocket(socketConnection));
      
      // Event listeners (if any) can be set up here
    }

    return () => {
      if (socketConnection) {
        socketConnection.close();
        dispatch(setSocket(null));
      }
    };
  }, [user, socket]);

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
