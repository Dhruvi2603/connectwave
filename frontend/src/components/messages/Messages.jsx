import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import UserImage from "../useImage/UserImage";
import { Link } from "react-router-dom";
import useGetAllMessage from "../../hooks/useGetAllMessage";
import useGetRealTimeMessage from "../../hooks/useGetRealTimeMessage";

const Messages = ({ selectedUser }) => {
  useGetAllMessage();
  useGetRealTimeMessage();
  const messages = useSelector((state) => state.messages) || [];
  const user = useSelector((state) => state.user) || {};
  const mode = useSelector((state) => state.mode);
  
  useEffect(() => {
    console.log(messages);
  }, [messages]);


  if (!selectedUser) {
    return <div>Select a user to start a conversation.</div>;
  }

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <div>
            <UserImage image={selectedUser.picturePath} />
          </div>
          <span className={`font-medium ${mode === 'light' ? 'text-black' : 'text-white'}`}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</span>
          <Link to={`/profile/${selectedUser._id}`}>
            <button className="mt-1 rounded-xl px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              View profile
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-4">
        {messages.length > 0 ? (
           
          messages.map((msg) => {
            return (
              <div
              key={msg._id}
                className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`py-2 px-4 rounded-lg max-w-xs break-words ${msg.senderId === user._id ? 'bg-blue-400 text-white' : 'bg-gray-300'}`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        ) : (
          <div>No messages found.</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
