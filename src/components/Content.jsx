import React from 'react'
import video from '../assets/video.mp4'
import pic from '../assets/image.png'

const Content = () => {
  return (
    <div>
        <div className="w-full h-screen flex items-center justify-center bg-black">
            <img className='object-cover w-full h-full opacity-5' src={pic} alt="none" />
    </div>
    </div>
  )
}

export default Content