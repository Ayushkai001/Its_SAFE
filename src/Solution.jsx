import React from 'react'
import Navbar from './components/Navbar.jsx'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import video from './assets/video.mp4'
import Scroll2 from './components/Scroll2.jsx'
const Solution = () => {
  useGSAP(() => {
    gsap.fromTo('.yokoso', 
      { y: -50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' , yoyo: true}
    );
  });
  return (
    <div className="mt-15 ">
      <Navbar />
      <div className='md:w-10/12 w-9/12 mx-auto yokoso'>
      <video src={video} autoPlay muted className='w-full rounded-lg shadow-lg '>
        </video>
        </div>
      <Scroll2 className="ohayou" />
    </div>
  )
}

export default Solution