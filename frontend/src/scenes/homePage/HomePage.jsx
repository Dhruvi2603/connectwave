import React from 'react'
import Navbar from '../navbar/Navbar'
import { useSelector } from 'react-redux'
import UserWidget from '../widgets/UserWidget';
import MyPostWidget from '../widgets/MyPostWidget';
import PostsWidget from '../widgets/PostsWidget';
import AdvertiseWidget from '../widgets/AdvertiseWidget';
import FriendListWidget from '../widgets/FriendListWidget';
import state from '../../state';

const HomePage = () => {

  const { _id, picturePath } = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);

  return (
    <div className={`${mode === 'light' ? 'bg-gray-200' : 'bg-gray-800'}`}>
      <Navbar />
      <div className='w-full xl:py-8 pt-4 pb-2 xl:px-[4%] px-3 md:flex block gap-2 justify-between'>
          <div className=' md:basis-28 lg:basis-[32%] xl:basis-[25%]'>
            <UserWidget userId={_id} picturePath={picturePath} />
          </div>
          <div className='md:basis-48 lg:basis-[42%] '>
             <MyPostWidget picturePath={picturePath} />
             <PostsWidget userId={_id} />
          </div>
          <div className='md:basis-[20%] lg:basis-[26%] '>
               <AdvertiseWidget />
               <div className='my-8 mx-0'></div>
               <FriendListWidget userId={_id} />
          </div>
      </div>
    </div>
  )
}

export default HomePage
