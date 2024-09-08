// FriendsChatWidget.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";
import FriendChat from "../../components/friendchat/FriendChat";


const FriendsChatWidget = ({ userId, onSelectFriend }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);
  const friends = useSelector((state) => state.user.friends) || [];

  const getFriends = async () => {
    try {
      const response = await fetch(
        `https://connectwave-backend.onrender.com/users/${userId}/friends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId, token, dispatch]);

  return (
    <div
      className={`p-4 pb-3.5 rounded-lg xl:my-4 my-3 mx-0 ${
        mode === "light" ? "bg-white" : "bg-slate-700 text-white"
      }`}
    >
      <p className="text-lg font-medium mb-6">Your Friends</p>
      <div className="flex flex-col gap-6">
        {Array.isArray(friends) &&
          friends.map((friend) => (
            <FriendChat
              key={friend._id}
              friend={friend}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              onClick={onSelectFriend} // Pass the onClick handler
            />
          ))}
      </div>
    </div>
  );
};

export default FriendsChatWidget;
