import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import state, { setFriends } from '../../state'
import UserImage from '../useImage/UserImage'
import { useNavigate } from 'react-router-dom'
import { adduser, removeuser } from '../../icons/icon'


const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
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
        <div onClick={() => {
          navigate(`/profile/${friendId}`);
          navigate(0);
        }}>
          <p className='text-lg font-medium hover:cursor-pointer'>{name}</p>
          <p className='text-xs'>{subtitle}</p>
        </div>
      </div>
      <div onClick={() => patchFriend()} className={`rounded-full p-3 hover:cursor-pointer ${mode === 'light' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'}`}>
        {isFriend ? (
          <i>{removeuser}</i>
        ) : ( <i>{adduser}</i> )}
      </div>
    </div>
  )
}

export default Friend
