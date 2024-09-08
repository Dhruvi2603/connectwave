import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import FriendListWidget from '../widgets/FriendListWidget'
import MyPostWidget from '../widgets/MyPostWidget'
import PostsWidget from '../widgets/PostsWidget'
import UserWidget from '../widgets/UserWidget'
import state from '../../state'


const ProfilePage = () => {
 const [user, setUser] = useState(null);
 const { userId } = useParams();
 const token = useSelector((state) => state.token);
 const mode = useSelector((state) => state.mode);
 
 const getUser = async () => {
  const response = await fetch(`https://connectwave-backend.onrender.com/users/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await response.json();
  setUser(data);
 }

 useEffect(() => {
  getUser();
 }, []);

 if (!user) return null;

  return (
    <div className={`bg-gray-200 ${mode === "light" ? "" : "bg-slate-900 text-white"}`}>
       <Navbar />
      <div className='w-full py-8 px-[4%] md:flex block gap-8 justify-center'>
          <div className=' md:basis-[40%] lg:basis-[32%] xl:basis-[25%]'>
            <UserWidget userId={userId} picturePath={user.picturePath} />
            <div className='my-8 mx-0'></div>
            <FriendListWidget userId={userId} />
          </div>
          <div className='md:basis-[42%]'>
             <MyPostWidget picturePath={user.picturePath} />
             <div className='my-8 mx-0'></div>
             <PostsWidget userId={userId} isProfile />
          </div>
      </div>
    </div>
  )
}

export default ProfilePage
