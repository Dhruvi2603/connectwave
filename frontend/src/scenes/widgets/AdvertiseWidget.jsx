import React from 'react'
import { useSelector } from 'react-redux'
import state from '../../state'




const AdvertiseWidget = () => {
   const mode = useSelector((state) => state.mode);

  return (
    <div className={`p-6 pb-3.5 rounded-lg mx-0 ${mode === 'light' ? 'bg-white' : 'bg-slate-700 text-white'}`}>
      <div className='flex items-center justify-between'>
        <p className='text-lg font-medium'>
            Sponsored
        </p>
        <p className=''>Create Ad</p>
      </div>
      <img className='w-full h-auto rounded-xl my-3 mx-0' src="http://localhost:3001/assets/info4.jpeg" alt="" />
      <div className='flex items-center justify-between'>
        <p>MikaCosmetics</p>
        <p>mikacosmetics.com</p>
      </div>
      <p className='my-2 mx-0'>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem aliquid, facilis enim hic laboriosam quod expedita doloribus autem itaque?
      </p>
    </div>
  )
}

export default AdvertiseWidget
