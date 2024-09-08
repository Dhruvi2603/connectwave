import React from 'react'

const UserImage = ({ image }) => {
  return (
    <div className='w-[60px] h-[60px]'>
      <img src={`https://connectwave-backend.onrender.com/assets/${image}`} alt="user" className=' object-cover rounded-[50%] w-[60px] h-[60px]' />
    </div>
  )
}

export default UserImage
