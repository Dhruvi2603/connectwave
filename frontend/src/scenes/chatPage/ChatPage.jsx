import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client"; // Import socket.io-client
import Navbar from "../../scenes/navbar/Navbar";
import FriendsChatWidget from "../../scenes/widgets/FriendsChatWidget";
import { addMessage, setMessages, setSelectedUser } from "../../state";
import UserImage from "../../components/useImage/UserImage";
import { chat } from "../../icons/icon";
import Messages from "../../components/messages/Messages";

const ChatPage = () => {
  const userId = useSelector((state) => state.user._id);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.selectedUser);
  const [textMessage, setTextMessage] = useState("");
  const messages = useSelector((state) => state.messages || []);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);

  useEffect(() => {
    const socket = io("https://connectwave-backend.onrender.com");

    // Listen for incoming messages
    socket.on('newMessage', (newMessage) => {
      dispatch(addMessage({ message: newMessage }));
    });

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [dispatch]);

  // Fetch and set user details
  const fetchUserDetails = async (userId) => {
    if (!userId || userId === selectedUser?._id) {
      return; // Do not fetch details for the current user or invalid user ID
    }
    try {
      const response = await axios.get(`https://connectwave-backend.onrender.com/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const user = response.data;
      dispatch(setSelectedUser(user));
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }

    // Clean up logic: Only if needed
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [userId]);

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(`https://connectwave-backend.onrender.com/message/${receiverId}`, { textMessage }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      if (res.data.success) {
        // Update the messages state with the new message
        dispatch(addMessage({ message: res.data.newMessage }));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleFriendSelect = (friendId) => {
    if (friendId !== userId) {
      fetchUserDetails(friendId); // Fetch user details when friend is selected
    }
  };

  return (
    <>
    <div className={`${mode === 'light' ? 'bg-gray-200' : 'bg-gray-800'}`}>
      <Navbar />
      
      <div className="flex flex-col md:flex-row md:h-screen">
        <div className={`lg:w-1/4 md:w-1/3 w-[95%] pl-4 xl:p-4 md:p-2 md:mt-3 xl:mt-0 mt-4 ${mode === 'light' ? 'bg-gray-200' : 'bg-gray-800'}`}>
          <FriendsChatWidget
            userId={userId}
            onSelectFriend={handleFriendSelect}
          />
        
        </div>
        <section className={`flex flex-col mt-8 mb-5 h-[80%] xl:w-4/5 lg:w-[70%] md:w-[63%]  mx-4 rounded-lg ${mode === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
          {selectedUser && selectedUser._id !== userId ? (
            <>
              <div className={`flex gap-3 items-center rounded-lg px-3 py-2 sticky top-0 ${mode === 'light' ? 'bg-white' : 'bg-gray-700 text-white'}`}>
                <div >
                  <UserImage image={selectedUser.picturePath || 'default-image-path'} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-xl">{`${selectedUser.firstName || 'Unknown'} ${selectedUser.lastName || 'User'}`}</span>
                  <span className="text-xs">{selectedUser.occupation}</span>
                </div>
              </div>
              <hr className="border-gray-500"/>
              <Messages selectedUser={selectedUser} />
              <div className="flex items-center p-4 border-t border-t-gray-300">
                <input 
                  value={textMessage} 
                  onChange={(e) => setTextMessage(e.target.value)} 
                  type="text" 
                  className="flex-1 mr-2 focus-visible:ring-transparent border-none outline-none py-1 rounded-lg" 
                  placeholder="Messages..." 
                />
                <button className="py-1 px-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg" onClick={() => sendMessageHandler(selectedUser._id)}>Send</button>
              </div>
            </>
          ) : (
            <div className={`flex flex-col flex-1 items-center justify-center ${mode === 'light' ? 'text-black' : 'text-white'}`}>
              <i className="text-9xl my-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{chat}</i>
              <h1 className="font-medium text-3xl">Your messages</h1>
              <span className="text-xl font-normal">Select a friend to start a chat.</span>
            </div>
          )}
        </section>
        </div>
        </div>
    </>
  );
};

export default ChatPage;
