import React, { useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from '../../state';
import UserImage from '../useImage/UserImage';
import { useNavigate } from 'react-router-dom';
import { adduser, removeuser } from '../../icons/icon';

const FriendChat = ({ friendId, name, subtitle, userPicturePath, onClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);
  const friends = useSelector((state) => state.user?.friends || []);

  const isFriend = Array.isArray(friends) && friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(`https://connectwave-backend.onrender.com/users/${_id}/${friendId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <div className={`flex items-center justify-between ${mode === 'light' ? 'bg-white' : 'bg-slate-700 text-white'}`}>
      <div className='flex items-center justify-between gap-4'>
        <UserImage image={userPicturePath} size="55px" />
        <div onClick={() => onClick(friendId)}>
          <p className='xl:text-lg md:text-sm text-xl font-medium hover:cursor-pointer'>{name}</p>
          <p className='text-xs'>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

FriendChat.propTypes = {
  friendId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  userPicturePath: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FriendChat;
